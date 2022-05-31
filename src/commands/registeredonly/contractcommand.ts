import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { ALLOW_MULTIPLE_PENDING_CONTRACTS, MINIMUM_HIT_PRICE, SELF_HITS, COMMAND_ERROR_MESSAGES } from "../../constants";
import Contract from '../../types/Contract';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN, isContractor, isHirer, findContract, pending_claims, dm_user } from '../../database';
import logger from "../../logger";

const ContractCommand: Command = {
    name: "contract",
    description: "The blanket command for interfacing with contracts.",
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
            description: "The ign of the target of this contract (setting only)",
            required: false,
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
            description: "The ign of the hirer of this contract. (for claiming, accepting, and denying only)",
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
        const user = findPlayerById(interaction.user.id);

        // User is not registered
        if (!user)
            response.setDescription(COMMAND_ERROR_MESSAGES.NOT_REGISTERED);

        else {
            switch (mode) 
            {
                case "set": 
                {
                    const target_string = String(interaction.options.get("target")?.value)
                    const target = findPlayerByIGN(target_string);
                    const price_string = interaction.options.get("price")?.value;
                    const contractor_string = String(interaction.options.get("contractor")?.value);
                    const price = Number(price_string);
                    const contractor = findPlayerByIGN(contractor_string);

                    if (price_string === undefined || price_string === "undefined")
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_PRICE);

                    else if (contractor_string === undefined || contractor_string === "undefined")
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_CONTRACTOR);

                    else if (target_string === undefined || target_string === "undefined")
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_TARGET);

                    else if (price < MINIMUM_HIT_PRICE)
                        response.setDescription(COMMAND_ERROR_MESSAGES.PRICE_TOO_LOW);

                    else if (!target)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_TARGET);
                    
                    // contractor not found
                    else if (!contractor)
                        response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACTOR_NOT_FOUND);

                    // Target is Self
                    else if (user.equals(target) && !SELF_HITS)
                        response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_IS_SELF);

                    else if (contractor.equals(target))
                        response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACTOR_IS_TARGET);

                    // User already has an active hit
                    else if (isHirer(user))
                        response.setDescription(COMMAND_ERROR_MESSAGES.HIRER_BUSY);

                    // Target is already under effect of a hit
                    else if (isTarget(target))
                        response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_BUSY);

                    // Contractor already has an active contract
                    else if (isContractor(contractor) && !ALLOW_MULTIPLE_PENDING_CONTRACTS)
                        response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACTOR_BUSY);

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
                        dm_user(contractor, new MessageEmbed().setDescription(`❓ ${user.ign} wants to contract you for a hit on ${target.ign} for ${price} diamonds. Use \`/contract mode:[accept/deny] target:${target.ign} hirer:${user.ign}\` to accept or deny it!`));
                        logger.info(`Player ${user.ign} placed new hit on ${target.ign}`);
                    }
    
                    break;
                }
                
                case "remove": 
                {
                    const contractor_string = String(interaction.options.get("contractor")?.value);
                    const contractor = findPlayerByIGN(contractor_string);

                    if (contractor_string === "undefined" || contractor_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_CONTRACTOR);

                    // Contractor not found
                    else if (!contractor)
                        response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACTOR_NOT_FOUND);

                    else {
                        const contract = findContract(user, contractor);

                        // Contract not found
                        if (!contract)
                            response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACT_NOT_FOUND);

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
                    const hirer_string = String(interaction.options.get("hirer")?.value);
                    const hirer = findPlayerByIGN(hirer_string);

                    if (hirer_string === undefined || hirer_string === "undefined")
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_HIRER);

                    // Hirer not found
                    if (!hirer)
                        response.setDescription(COMMAND_ERROR_MESSAGES.HIRER_NOT_FOUND);

                    else 
                    {
                        const contract = findContract(hirer, user);

                        // contract not found
                        if (!contract)
                            response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACT_NOT_FOUND);

                        else if (!user.equals(contract.contractor))
                            response.setDescription("❌ You are not the contractor for this hit.");

                        else if (contract.pending)
                            response.setDescription("❌ You have to accept this hit before you can claim it.");

                        // user is target
                        else if (user.equals(contract.target))    
                            response.setDescription(COMMAND_ERROR_MESSAGES.CLAIMER_IS_TARGET);

                        else if (user.equals(contract.placer))
                            response.setDescription(COMMAND_ERROR_MESSAGES.CLAIMER_IS_HIRER);

                        // success
                        else {
                            logger.info(`User ${user.ign} is attempting to claim contract against player ${contract.target.ign} placed by user ${contract.placer.ign} for ${contract.price} diamonds.`);
                            response.setDescription(`✅ Attempting to claim contract against player ${contract.target.ign} for 💰 ${contract.price} diamonds! Once it has been verified by an administrator, it will be completed.`);
                            dm_user(hirer, new MessageEmbed().setDescription(`${user.ign} is attempting to claim your hit on ${contract.target.ign}. It is now awaiting administrator verification.`));
                            hits.splice(hits.indexOf(contract), 1);
                            contract.claimer = user;
                            contract.claim_time = new Date();
                            pending_claims.push(contract);
                        }
                    }
                    break;
                }

                case "view": 
                {
                    response.setTitle("YOUR CURRENT CONTRACTS").setDescription("");
                    let active_contract: string = "", pending_contract: string = "", active_placed_contract = "";

                    /**
                     * Contractor Contract
                     */
                    for (let i = 0; i < hits.length; i++)
                        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(user) && !(<Contract> hits[i]).pending) {
                            active_contract = "**Active contract:**\n" + hits[i].toString;
                            break;
                        }
                    if (active_contract == "")
                        active_contract = "👍 You have no active contracts (with you as the contractor)!\n"
                    else
                        active_contract = "**Active Uncompleted Contract (with you as the contractor):**\n" + active_contract + "\n";

                    response.description += active_contract;

                    /**
                     * Placed Contract
                     */
                    for (let i = 0; i < hits.length; i++)
                        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(user) && !(<Contract> hits[i]).pending) {
                            active_placed_contract = "**Active contract:**\n" + hits[i].toString;
                            break;
                        }
                    if (active_placed_contract == "")
                        active_placed_contract = "👍 You have not placed any contracts!\n"
                    else
                        active_placed_contract = "**Active Uncompleted Contract (with you as the placer):**\n" + active_placed_contract + "\n\n";

                    response.description += active_placed_contract;

                    /**
                     * Pending Contracts
                     */
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
                    const hirer_string = String(interaction.options.get("hirer")?.value);
                    const hirer = findPlayerByIGN(hirer_string);

                    if (hirer_string === "undefined" || hirer_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_HIRER);

                    // Hirer not found
                    else if (!hirer)
                        response.setDescription(COMMAND_ERROR_MESSAGES.HIRER_NOT_FOUND);

                    // User already has an active contract
                    else if (isContractor(user))
                        response.setDescription("❌ You already have an active contract");

                    else {
                        const contract = findContract(hirer, user);
                        
                        // contract not found
                        if (!contract)
                            response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACT_NOT_FOUND);
                        
                        // Success
                        else {
                            response.setDescription(`🟢 Accepted contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                            logger.info(`${user.ign} accepted contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                            const hirer_response = new MessageEmbed().setDescription(`🟢 ${user.ign} accepted your contract kill on ${contract.target.ign} for ${contract.price} diamonds.`);
                            contract.pending = false;
                            dm_user(hirer, hirer_response);
                            dm_user(contract.target, new MessageEmbed().setDescription(`:warning: Be careful, a new **Contract** was just placed on your head for ${contract.price} diamonds.`));
                        }
                    }
                    break;
                }

                case "deny":
                {
                    const hirer_string = String(interaction.options.get("hirer")?.value);
                    const hirer = findPlayerByIGN(hirer_string);

                    if (hirer_string === "undefined" || hirer_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_HIRER);

                    // Hirer not found
                    else if (!hirer)
                        response.setDescription(COMMAND_ERROR_MESSAGES.HIRER_NOT_FOUND);

                    else {
                        const contract = findContract(hirer, user);
                        
                        // contract not found
                        if (!contract)
                            response.setDescription(COMMAND_ERROR_MESSAGES.CONTRACT_NOT_FOUND);
                        
                        // Success
                        else {
                            response.setDescription(`🛑 Denied contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                            logger.info(`${user.ign} denied contract from ${contract.placer.ign} on ${contract.target.ign} for ${contract.price} diamonds.`);
                            const hirer_response = new MessageEmbed().setDescription(`🛑 ${user.ign} denied your contract kill on ${contract.target.ign} for ${contract.price} diamonds.`);
                            hits.splice(hits.indexOf(contract), 1);
                            hirer.lastPlacedHit = false;
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