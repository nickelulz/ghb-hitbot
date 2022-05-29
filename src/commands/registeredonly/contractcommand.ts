import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { ALLOW_MULTIPLE_PENDING_CONTRACTS, MINIMUM_HIT_PRICE, SELF_HITS } from "../../constants";
import Contract from '../../types/Contract';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN, isContractor, isHirer, findContract, pending_claims, dm_user } from '../../database';
import logger from "../../logger";

const ContractCommand: Command = {
    name: "contract",
    description: "The blanket command for interfacing with contracts. Set a new one, Remove a contract you already placed, or Claim a contract you are the contractor for, or Accept/Deny a pending contract.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "mode",
            description: "set/remove/claim/accept/deny/view",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "target",
            description: "The ign of the target of this contract.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "contractor",
            description: "The ign of the contractor of this contract. (for setting and removing only)",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "hirer",
            description: "The ign of the hirer of this contract. (for claiming only)",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "price",
            description: "The price of this contract. (for setting only)",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const mode = String(interaction.options.get("mode")?.value);
        const target = findPlayerByIGN(String(interaction.options.get("target")?.value));
        const user = findPlayerById(interaction.user.id);

        // User is not registered
        if (!user)
            response.setDescription("❌ You are NOT a registered user! Use \`/register\` to register to use this command.");

        // Target is not registered
        else if (!target)
            response.setDescription("❌ The target of this hit is NOT a registered user! (And therefore, was not found in the registry.)");

        else {
            switch (mode) 
            {
                case "set": 
                {
                    const price = Number(interaction.options.get("price")?.value);
                    const contractor = findPlayerByIGN(String(interaction.options.get("contractor")?.value));

                    if (price < MINIMUM_HIT_PRICE)
                        response.setDescription(`Price is too low! *The Minimum price for a hit is ${MINIMUM_HIT_PRICE} diamonds.*`);
                    
                    // contractor not found
                    else if (!contractor)
                        response.setDescription("❌ Your intended contractor is NOT a registered user! They have to be registered to contract with them!");

                    // Target is Self
                    else if (user.equals(target) && !SELF_HITS)
                        response.setDescription("❌ You cannot place a hit on yourself! *(unless you\'re into that sort of thing...)*");

                    // User already has an active hit
                    else if (isHirer(user))
                        response.setDescription("❌ You already have an active hit out on someone. You cannot have two hits at once.");

                    // Target is already under effect of a hit
                    else if (isTarget(target))
                        response.setDescription("⏱️ Your target is currently under the effect of a hit! Wait until 1 hour after that hit is completed.");

                    // Contractor already has an active contract
                    else if (isContractor(contractor) && !ALLOW_MULTIPLE_PENDING_CONTRACTS)
                        response.setDescription("❌ Your contractor already has an active contract!");

                    // User is still under placing cooldown
                    else if (user.hiringCooldown > 0)
                        response.setDescription(`⏱️ You are still under a cooldown! \`${user.hiringCooldownString} left!\``);

                    // Target is under cooldown
                    else if (target.targetingCooldown > 0)
                        response.setDescription(`⏱️ Your target is still under a cooldown from being targeted for a hit. \`${target.targetingCooldownString} left.\``);

                    // Contractor is still under cooldown
                    else if (contractor.contractingCooldown > 0)
                        response.setDescription(`⏱️ Your contractor is still under a cooldown for doing contract hits. \`${contractor.contractingCooldownString} left.\``);
                    
                    // Success
                    else {
                        const current_time: Date = new Date();
                        hits.push(new Contract(user, target, price, current_time, contractor, true));
                        user.lastPlacedHit = current_time;
                        response.description = `✅ Successfully set new contract for ${contractor.ign} on ${target.ign} for ${price} diamonds. Now it needs to be confirmed by the user.`;

                        // DM the contractor with the proposition
                        Promise.resolve(client.users.fetch(contractor.discordId)).then((contractor_discord: DiscordJS.User | undefined) => {
                            if (contractor_discord === undefined)
                                logger.error(`User ${contractor.ign} has an invalid discord ID not found in bot cache. (@110-contractcommand.ts)`);
                            else {
                                try {
                                    contractor_discord.send({ embeds: [
                                        new MessageEmbed()
                                            .setDescription(`❓ ${user.ign} wants to contract you for a hit on ${target.ign} for ${price} diamonds. Use \`/contract [accept/deny] ${user.ign}\` to accept or deny it!`)
                                    ] });
                                } catch (err: any) {
                                    logger.error(`Cannot message user ${contractor.ign}.`);
                                }
                            }
                        });

                        logger.info(`Player ${user.ign} placed new hit on ${target.ign}`);
                    }
    
                    break;
                }
                
                case "remove": 
                {
                    const contractor = findPlayerByIGN(String(interaction.options.get("contractor")?.value));
                    // Contractor not found
                    if (!contractor)
                        response.setDescription("❌ The contactor you selected was not found in the player registry. Either they are not registered or the bot is broken.");

                    else {
                        const contract = findContract(user, contractor);

                        // Contract not found
                        if (!contract)
                            response.setDescription("❌ The contract you intend to remove was not found. Make sure that you are matching the players correctly, and check with \`/listbounties\`. Alternatively, you might have already removed it. :)");

                        // User is not the user of this contract
                        else if (!user.equals(contract.placer))
                            response.setDescription(`❌ You are not the player who placed this hit! ${contract.placer.toString} placed this!`);

                        // Success
                        else 
                        {
                            hits.splice(hits.indexOf(contract), 1);
                            response.setDescription(`✅ Removed listed contract against player ${contract.target.ign} for ${contract.price} diamonds!`);
                            logger.info(`Player ${user.ign} removed their hit on ${contract.target.ign} for ${contract.price} diamonds.`);
                        }
                    }
                    break;
                }
                
                case "claim": 
                {
                    const hirer = findPlayerByIGN(String(interaction.options.get("hirer")?.value));

                    // Hirer not found
                    if (!hirer)
                        response.setDescription("❌ The hirer of this hit is not a registered user. (And therefore, not found in the registry.)");

                    else 
                    {
                        const contract = findContract(hirer, user);

                        // contract not found
                        if (!contract)
                            response.setDescription("❌ The contract you intend to claim was not found. Make sure that you are matching the players correctly, and check with \`/contract view\`");

                        // user is target
                        else if (user.equals(contract.target))    
                            response.setDescription("❌ You cannot claim your own hit this way. To claim hits placed against you, use \`/counterclaim\`");

                        // success
                        else {
                            logger.info(`User ${user.ign} is attempting to claim contract against player ${contract.target.ign} placed by user ${contract.placer.ign} for ${contract.price} diamonds.`);
                            response.setDescription(`✅ Attempting to claim contract against player ${contract.target.ign} for 💰 ${contract.price} diamonds! Once it has been verified by an administrator, it will be completed.`);
                            dm_user(hirer, new MessageEmbed().setDescription(`${user.ign} is attempting to claim your hit on ${contract.target.ign}. It is now awaiting administrator verification.`));
                            hits.splice(hits.indexOf(contract), 1);
                            pending_claims.push(contract);
                        }
                    }
                    break;
                }

                case "view": 
                {
                    response.setTitle("YOUR CURRENT CONTRACTS").setDescription("");

                    let active_contract: string = "", pending_contract: string = "";
                    for (let i = 0; i < hits.length; i++)
                        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(user) && !(<Contract> hits[i]).pending) {
                            active_contract = "**Active contract:**\n" + hits[i].toString;
                            break;
                        }
                    if (active_contract == "")
                        active_contract = "👍 You have no active contracts!\n"

                    response.description += active_contract;

                    let count = 0;
                    for (let i = 0; i < hits.length; i++)
                        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(user) && (<Contract> hits[i]).pending) {
                            pending_contract += (i+1) + " " + hits[i].toString + "\n";
                            count++;
                        }
                    if (count = 0)
                        pending_contract = "🥸 You have no pending contracts!\n";
                    else  {
                        pending_contract = "**Pending Contracts:**\n" + pending_contract;
                        pending_contract += `👌 You have ${count} pending contracts!\n`
                    }

                    response.description += "\n" + pending_contract;
                        
                    break;   
                }

                case "accept":
                {
                    const hirer = findPlayerByIGN(String(interaction.options.get("hirer")?.value));

                    // Hirer not found
                    if (!hirer)
                        response.setDescription("❌ The hirer of this hit is not a registered user. (And therefore, not found in the registry.)");

                    // User already has an active contract
                    else if (isContractor(user))
                        response.setDescription("❌ You already have an active contract");

                    else {
                        const contract = findContract(hirer, user);
                        
                        // contract not found
                        if (!contract)
                            response.setDescription("❌ The contract you intend to claim was not found. Make sure that you are matching the players correctly, and check with \`/contract view\`");
                        
                        // Success
                        else {
                            response.setDescription(`🟢 Accepted contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                            const hirer_response = new MessageEmbed().setDescription(`🟢 ${user.ign} accepted your contract kill on ${contract.target.ign} for ${contract.price} diamonds.`);
                            contract.pending = false;
                            dm_user(hirer, hirer_response);
                        }
                    }
                    break;
                }

                case "deny":
                {
                    const hirer = findPlayerByIGN(String(interaction.options.get("hirer")?.value));

                    // Hirer not found
                    if (!hirer)
                        response.setDescription("❌ The hirer of this hit is not a registered user. (And therefore, not found in the registry.)");

                    else {
                        const contract = findContract(hirer, user);
                        
                        // contract not found
                        if (!contract)
                            response.setDescription("❌ The contract you intend to claim was not found. Make sure that you are matching the players correctly, and check with \`/contract view\`");
                        
                        // Success
                        else {
                            response.setDescription(`🛑 Denied contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                            const hirer_response = new MessageEmbed().setDescription(`🛑 ${user.ign} denied your contract kill on ${contract.target.ign} for ${contract.price} diamonds.`);
                            hits.splice(hits.indexOf(contract), 1);
                            dm_user(hirer, hirer_response);
                        }
                    }
                    break;
                }

                default: 
                {
                    response.setDescription("❌ The mode has to be either \'set\', \'remove\', \'claim\', \'view\', \'accept\', or \'deny\'.");
                    break;
                }
            }
            save();
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ContractCommand;