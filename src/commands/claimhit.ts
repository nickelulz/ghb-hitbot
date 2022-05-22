import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { hits, findPlayerById, save } from "../database";
import Hit from "../types/Hit";
import logger from "../logger";

const ClaimHit: Command = {
    name: "claimhit",
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
        const index = /* interaction.options.get() */ 0; // < temporary solution
        const selectedHit: Hit = hits[index];
        const user = findPlayerById(interaction.user.id);

        let content = "";
        if (!user)
            content = "❌ You are not a registered user!";
        else if (!(index in hits))
            content = "❌ Your selected index is not a listed hit! Make sure to use a correct index (check indexes with \`/listhits\`)"
        else if (user.equals(selectedHit.placer))
            content = `❌ You can\'t claim your own hit!`;
        else if (user.equals(selectedHit.target)) {
            hits.splice(index, 1);
            content = `✅ Counterclaimed hit at index ${index} against you ${selectedHit.target.ign}!`;
            logger.info(`User ${user.ign} claimed hit ${index} placed by user ${selectedHit.placer.ign} against themself for ${selectedHit.price} diamonds.`);
            user.killCount++;
            user.lastTargetedHit = selectedHit.place_time;
            selectedHit.placer.lastPlacedHit = selectedHit.place_time;
            save();
        }
        else {
            hits.splice(index, 1);
            content = `✅ Claimed listed hit ${index} against player ${selectedHit.target.ign} for 💰 ${selectedHit.price} diamonds!`;
            logger.info(`User ${user.ign} claimed hit ${index} placed by user ${selectedHit.placer.ign} against player ${selectedHit.target.ign} for ${selectedHit.price} diamonds.`);
            user.killCount++;
            user.lastPlacedHit = selectedHit.place_time;
            selectedHit.target.deathCount++;
            selectedHit.target.lastTargetedHit = selectedHit.place_time;
            save();
        }


        await interaction.followUp({
            content
        });
    }
}; 

export default ClaimHit;