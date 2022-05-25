import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "src/types/Command";
import { hits, findPlayerById, save } from "../../database";
import Contract from "../../types/Contract";
import Bounty from "../../types/Bounty";
import logger from "../../logger";

const RemoveHit: Command = {
    name: "removehit",
    description: "De-list a hit on a selected person",
    type: "CHAT_INPUT",
    options: [
        {
            name: "hit-number",
            description: "The index of the hit (ex: 3)",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const { options } = interaction;
        const index: number = Number(options.get("hit-number")?.value);
        const selectedHit: Bounty = hits[index];
        const user = findPlayerById(interaction.user.id);

        let content = "";
        if (!user)
            content = "❌ You are not a registered user!";
        else if (!user.equals(selectedHit.placer) && !user.isAdmin) {
            logger.error(`user ${user.toString} compared to user ${selectedHit.placer.toString}`);
            content = `❌ You are not the player who placed this hit! ${selectedHit.placer.toString} placed this!`;
        }
        else {
            hits.splice(index, 1);
            content = `✅ Removed listed hit at index ${index} against player ${selectedHit.target.ign} for ${selectedHit.price} diamonds!`;
            logger.info(`Player ${user.ign} removed hit on ${selectedHit.target.ign} for ${selectedHit.price} diamonds at index ${index}.`);
            save();
        }


        await interaction.followUp({
            content
        });
    }
}; 

export default RemoveHit;