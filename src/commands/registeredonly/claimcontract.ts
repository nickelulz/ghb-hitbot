import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { hits, findPlayerById, save } from "../../database";
import Bounty from "../../types/Bounty";
import logger from "../../logger";

const ClaimHit: Command = {
    name: "claimhit",
    description: "De-list a hit on a selected person",
    type: "CHAT_INPUT",
    options: [
        {
            name: "hit-index",
            description: "The index of the hit (ex: 3)",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const index =  Number(interaction.options.get("hit-index"))
        const selectedHit: Bounty = hits[index];
        const user = findPlayerById(interaction.user.id);
        const response = new MessageEmbed();

        if (!user)
            response.description = "❌ You are not a registered user!";
        else if (!(index in hits))
            response.description = "❌ Your selected index is not a listed hit! Make sure to use a correct index (check indexes with \`/listhits\`)"
        else {
            logger.info(`User ${user.ign} claimed hit ${index} placed by user ${selectedHit.placer.ign} against player ${selectedHit.target.ign} for ${selectedHit.price} diamonds.`);
            if (user.equals(selectedHit.target)) {
                response.description = `✅ Counterclaimed hit at index ${index} against you ${selectedHit.target.ign}!`;
            }
            else {
                response.description = `✅ Claimed listed hit ${index} against player ${selectedHit.target.ign} for 💰 ${selectedHit.price} diamonds!`;
                selectedHit.target.deathCount++;
            }
            user.killCount++;
            user.lastPlacedHit = selectedHit.place_time;
            selectedHit.target.lastTargetedHit = selectedHit.place_time;
            hits.splice(index, 1);
            save();
        }


        await interaction.followUp({
            embeds: [ response ]
        });
    }
}; 

export default ClaimHit;