import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { findHitByTarget, findPlayerById, findPlayerByIGN, hits, isTarget, pending_claims, save, completed_hits, dm_user } from "../../database";
import Contract from '../../types/Contract'
import Command from "../../types/Command";

const CounterClaim: Command = {
    name: "counterclaim",
    description: "Claim a hit that was placed on you (in the event that you killed your assassin)",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("If you\'re seeing this message, something went wrong.");
        const user = findPlayerById(interaction.user.id);

        // User not found in registry
        if (!user)
            response.setDescription("❌ You are NOT a registered user! Use \`/register\` to register to use this command.");

        // User is not a target
        else if (!isTarget(user))
            response.setDescription("❌ You have no hits currently placed against you.");
        
        else {
            const hit = findHitByTarget(user);

            // No hits found
            if (!hit)
                response.setDescription("❌ Could not find any hits currently placed on you.");

            else {
                //  admin verification?
                response.setDescription("✅ Attempting to counterclaim this hit. Once it has been *verified* by an administator, it will be registered as completed.");
                hits.splice(hits.indexOf(hit), 1);
                pending_claims.push(hit);
                save();
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default CounterClaim;