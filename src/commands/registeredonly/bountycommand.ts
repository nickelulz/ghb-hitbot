import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { MINIMUM_HIT_PRICE, SELF_HITS, COMMAND_ERROR_MESSAGES } from "../../constants";
import Bounty from '../../types/Bounty';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN, findBounty, isHirer, pending_claims, dm_user } from '../../database';
import logger from "../../logger";

const BountyCommand: Command = {
    name: "bounty",
    description: "The blanket command for interfacing with bounties.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "mode",
            description: "set/remove/claim/list",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "target",
            description: "The ign of the target of this bounty.",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "hirer",
            description: "The ign of the hirer of this bounty. (for claiming only)",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "price",
            description: "The price of this bounty. (for setting only)",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("If you\'re seeing this message, something went wrong.");
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
                    const price_string = String(interaction.options.get("price")?.value);
                    const price = Number(price_string);

                    const target_string = String(interaction.options.get("target")?.value);
                    const target = findPlayerByIGN(target_string);

                    if (price_string === "undefined" || price_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_PRICE);

                    else if (price < MINIMUM_HIT_PRICE)
                        response.setDescription(COMMAND_ERROR_MESSAGES.PRICE_TOO_LOW);

                    else if (target_string === "undefined" || target_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_TARGET);

                    // Target is not registered
                    else if (!target)
                        response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_NOT_FOUND);

                    else 
                    {
                        const current_time: Date = new Date();
                        
                        // Target is already under effect of a hit
                        if (isTarget(target))
                            response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_BUSY);
                        
                        // Target is Self
                        else if (user.equals(target) && !SELF_HITS)
                            response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_IS_SELF);

                        // User already has an active hit
                        else if (isHirer(user))
                            response.setDescription(COMMAND_ERROR_MESSAGES.HIRER_BUSY);

                        // Placer is still under cooldown
                        else if (user.hiringCooldown > 0)
                            response.setDescription(`⏱️ You are still under a cooldown! \`${user.hiringCooldownString} left!\``);
            
                        // Target is under cooldown
                        else if (target.targetingCooldown > 0)
                            response.setDescription(`⏱️ Your target is still under a cooldown from being targeted for a hit. \`${target.targetingCooldownString} left.\``);
            
                        // Success
                        else {
                            hits.push(new Bounty(user, target, price, current_time));
                            user.lastPlacedHit = current_time;
                            response.setDescription(`✅ Successfully placed new hit on player ${target.ign}`);
                            dm_user(target, new MessageEmbed().setDescription(`:warning:  Be careful, a new **Bounty** was just placed on your head for ${price} diamonds by ${user.ign}!`));
                            logger.info(`Player ${user.ign} placed new hit on ${target.ign}`);
                        }
                    }
    
                    break;
                }
                
                case "remove": 
                {

                    const target_string = String(interaction.options.get("target")?.value);
                    const target = findPlayerByIGN(target_string);

                    if (target_string === "undefined" || target_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_TARGET);

                    // Target is not registered
                    else if (!target)
                        response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_NOT_FOUND);
                    
                    else 
                    {
                        const bounty = findBounty(user, target);
                        if (!bounty)
                            response.setDescription(COMMAND_ERROR_MESSAGES.BOUNTY_NOT_FOUND);
                        else
                        {
                            hits.splice(hits.indexOf(bounty), 1);
                            response.description = `✅ Removed listed bounty against player ${bounty.target.ign} for ${bounty.price} diamonds!`;
                            logger.info(`Player ${user.ign} removed their hit on ${bounty.target.ign} for ${bounty.price} diamonds.`);
                        }
                    }
                    break;
                }
                
                case "claim": 
                {
                    const hirer_string = String(interaction.options.get("hirer")?.value);
                    const hirer = findPlayerByIGN(hirer_string);

                    const target_string = String(interaction.options.get("target")?.value);
                    const target = findPlayerByIGN(target_string);

                    if (hirer_string === undefined || hirer_string === "undefined")
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_HIRER);

                    // Hirer not found
                    else if (!hirer)
                        response.setDescription(COMMAND_ERROR_MESSAGES.HIRER_NOT_FOUND);

                    else if (target_string === "undefined" || target_string === undefined)
                        response.setDescription(COMMAND_ERROR_MESSAGES.NO_TARGET);

                    // Target is not registered
                    else if (!target)
                        response.setDescription(COMMAND_ERROR_MESSAGES.TARGET_NOT_FOUND);

                    else 
                    {
                        const bounty = findBounty(hirer, target);

                        // Bounty not found
                        if (!bounty)
                            response.setDescription(COMMAND_ERROR_MESSAGES.BOUNTY_NOT_FOUND);

                        // user is target
                        else if (user.equals(bounty.target))    
                            response.setDescription(COMMAND_ERROR_MESSAGES.CLAIMER_IS_TARGET);

                        else if (user.equals(bounty.placer))
                            response.setDescription(COMMAND_ERROR_MESSAGES.CLAIMER_IS_HIRER);

                        // Success
                        else 
                        {
                            logger.info(`User ${user.ign} is attempting to claim bounty against player ${bounty.target.ign} placed by user ${bounty.placer.ign} for ${bounty.price} diamonds.`);
                            response.setDescription(`✅ Successfully attempting to claim bounty against player ${bounty.target.ign} for 💰 ${bounty.price} diamonds. Once it is verified by an administrator, you\'re all set.`);
                            dm_user(hirer, new MessageEmbed().setDescription(`${user.ign} is attempting to claim your hit on ${bounty.target.ign}. It is now awaiting administrator verification.`));
                            hits.splice(hits.indexOf(bounty), 1);
                            bounty.claimer = user;
                            bounty.claim_time = new Date();
                            pending_claims.push(bounty);
                        }
                    }
                    break;
                }

                case "list": 
                {
                    response.description = "";
                    let count = 1;

                    for (let i = 0; i < hits.length; i++)
                        if (hits[i] instanceof Bounty)
                            response.description += count++ + " -> " + hits[i].toString + "\n";
            
                    if (response.description.length == 0)
                        response.description = "👍 No bounties are currently placed!";
            
                    if (!user)
                        response.description += "\n\n\`💡 Make sure to register to place hits, remove hits, and claim hits...\`";
                    else 
                        response.setTitle("HITS");
            
                    if (response.description == "")
                        response.setDescription("❌ Error in getting the list of bounties. Try again later? :)");
                        
                    break;
                }

                default: 
                {
                    response.setDescription("❌ The mode has to be either \'set\', \'remove\', or \'claim\'.");
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

export default BountyCommand;