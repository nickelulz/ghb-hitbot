import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { MINIMUM_HIT_PRICE, SELF_HITS } from "../../constants";
import Bounty from '../../types/Bounty';
import { hits, findPlayerById, isTarget, save, findPlayerByIGN, findBounty, isHirer } from '../../database';
import logger from "../../logger";

const BountyCommand: Command = {
    name: "bounty",
    description: "The blanket command for interfacing with bounties. Set a new one, Remove a bounty you already placed, or Claim a listed bounty.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "mode",
            description: "set/remove/claim",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "target",
            description: "The ign of the target of this bounty.",
            required: true,
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
                    if (price < MINIMUM_HIT_PRICE)
                        response.setDescription(`Price is too low! *The Minimum price for a hit is ${MINIMUM_HIT_PRICE} diamonds.*`);

                    else 
                    {
                        const current_time: Date = new Date();
                        
                        // Target is already under effect of a hit
                        if (isTarget(target))
                            response.setDescription("❌ Your target is currently under the effect of a hit! Wait until 1 hour after that hit is completed.");
                        
                        // Target is Self
                        else if (user.equals(target) && !SELF_HITS)
                            response.setDescription("❌ You cannot place a hit on yourself! *(unless you\'re into that sort of thing...)*");

                        // User already has an active hit
                        else if (isHirer(user))
                            response.setDescription("❌ You already have an active hit out on someone. You cannot have two hits at once.");

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
                            logger.info(`Player ${user.ign} placed new hit on ${target.ign}`);
                        }
                    }
    
                    break;
                }
                
                case "remove": 
                {
                    const bounty = findBounty(user, target);
                    if (!bounty)
                        response.setDescription("❌ The bounty you intend to remove was not found. Make sure that you are matching the players correctly, and check with \`/listbounties\`. Alternatively, you might have already removed it. :)");
                    else
                    {
                        // User is not the placer of this bounty
                        if (!user.equals(bounty.placer))
                            response.setDescription(`❌ You are not the player who placed this hit! ${bounty.placer.toString} placed this!`);

                        else {
                            hits.splice(hits.indexOf(bounty), 1);
                            response.description = `✅ Removed listed bounty against player ${bounty.target.ign} for ${bounty.price} diamonds!`;
                            logger.info(`Player ${user.ign} removed their hit on ${bounty.target.ign} for ${bounty.price} diamonds.`);
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
                        const bounty = findBounty(hirer, target);

                        // Bounty not found
                        if (!bounty)
                            response.setDescription("❌ The bounty you intend to claim was not found. Make sure that you are matching the players correctly, and check with \`/listbounties\`");

                        else 
                        {
                            logger.info(`User ${user.ign} claimed bounty against player ${bounty.target.ign} placed by user ${bounty.placer.ign} for ${bounty.price} diamonds.`);

                            if (user.equals(bounty.target))
                                response.description = `✅ Counterclaimed bounty placed by ${bounty.placer.ign} against you ${bounty.target.ign}!`;
                            else {
                                response.description = `✅ Claimed bounty against player ${bounty.target.ign} for 💰 ${bounty.price} diamonds!`;
                                bounty.target.deathCount++;
                            }

                            user.killCount++;
                            user.lastPlacedHit = bounty.place_time;
                            bounty.target.lastTargetedHit = bounty.place_time;
                            hits.splice(hits.indexOf(bounty), 1);
                        }
                    }
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