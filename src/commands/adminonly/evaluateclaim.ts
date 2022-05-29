import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { findHitByTarget, findPlayerById, findPlayerByIGN, hits, isTarget, pending_claims, save, completed_hits, dm_user } from "../../database";
import Contract from '../../types/Contract'
import Command from "../../types/Command";

const EvaluateClaim: Command = {
    name: "evaluateclaim",
    description: "Evaluate a claim placed on a hit. (Requires administrator permissions).",
    type: "CHAT_INPUT",
    options: [
        {
            name: "mode",
            description: "set/verify/list/reject - view and list require administator permissions.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "ign",
            description: "The IGN of the user who placed the claim. (For verification/rejection only).",
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("");
        const user = findPlayerById(interaction.user.id);
        const mode = String(interaction.options.get("mode")?.value);

        // User not found in registry
        if (!user)
            response.setDescription("❌ You are NOT a registered user! Use \`/register\` to register to use this command.");

        else {
            switch (mode) {
                case "verify": 
                {
                    const placer = findPlayerByIGN(String(interaction.options.get("ign")?.value));
                    if (!user.isAdmin)
                        response.setDescription("❌ This command requires administrator permissions.");
                    else if (!placer)
                        response.setDescription("❌ Could not find the placer of this counterclaim!");
                    else {
                        const claimed_hit = pending_claims.find(hit => hit.target.equals(placer));
                        if (claimed_hit === undefined)
                            response.setDescription("❌ Could not find a pending counterclaim of this user.");
                        else {
                            response.setDescription(`✅ Verified counterclaim from ${placer.ign}.`);
                            dm_user(placer, new MessageEmbed().setDescription(`✅ Your claim on a hit placed by player ${claimed_hit.placer.ign} was verified by administrator ${user.ign}.`));
                            dm_user(claimed_hit.placer, new MessageEmbed().setDescription(`✅ Your hit on ${claimed_hit.target.ign} was completed by ${placer.ign}. You now owe them ${claimed_hit.price} diamonds.`));
                            pending_claims.splice(pending_claims.indexOf(claimed_hit), 1);
                            completed_hits.push(claimed_hit);

                            if (placer.equals(claimed_hit.target) && claimed_hit instanceof Contract)
                                (<Contract> claimed_hit).contractor.deathCount++;
                            else
                                claimed_hit.target.deathCount++;

                            user.killCount++;
                            user.lastPlacedHit = claimed_hit.place_time;
                            claimed_hit.target.lastTargetedHit = claimed_hit.place_time;
                            save();
                        }
                    }
                    break;
                }

                case "reject": 
                {
                    const placer = findPlayerByIGN(String(interaction.options.get("ign")?.value));
                    if (!user.isAdmin)
                        response.setDescription("❌ This command requires administrator permissions.");
                    else if (!placer)
                        response.setDescription("❌ Could not find the placer of this counterclaim!");
                    else {
                        const claimed_hit = pending_claims.find(hit => hit.target.equals(placer));
                        if (claimed_hit === undefined)
                            response.setDescription("❌ Could not find a pending counterclaim of this user.");
                        else {
                            response.setDescription(`✅ Rejected counterclaim from ${placer.ign}.`);
                            pending_claims.splice(pending_claims.indexOf(claimed_hit), 1);
                            dm_user(placer, new MessageEmbed().setDescription(`❌ Your claim on a hit placed by ${claimed_hit.placer.ign} against player ${claimed_hit.placer.ign} was rejected by administrator ${user.ign}.`));
                            dm_user(claimed_hit.placer, new MessageEmbed().setDescription(`${placer.ign} attempted to claim your hit placed against ${claimed_hit.target.ign}, but it was rejected by administrator ${user.ign}`));
                            save();
                        }
                    }
                    break;
                }

                case "list":
                {
                    if (!user.isAdmin)
                        response.setDescription("❌ This command requires administrator permissions.");
                    else {
                        for (let i = 0; i < pending_claims.length; i++)
                            response.description += `${i+1}: ${pending_claims[i].target}->${pending_claims[i].placer}. Claimed at ${pending_claims[i].claim_time}`;
                        if (response.description == "")
                            response.setDescription("👍 There are no claims pending verification.");
                        else
                            response.setTitle("CLAIMS PENDING VERIFICATION");
                    }
                    break;
                }

                default: 
                {
                    response.setDescription("❌ The mode has to be either \'set\', \'verify\', or \'list\'.");
                    break;
                }
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default EvaluateClaim;