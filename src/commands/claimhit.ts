import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { hits, findPlayerById } from "../database";
import Hit from "../types/Hit";

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
        else {
            hits.splice(index, 1);
            content = `✅ Claimed listed hit at index ${index} against player ${selectedHit.target} for 💰 ${selectedHit.price} diamonds!`;
        }


        await interaction.followUp({
            content
        });
    }
}; 

export default ClaimHit;