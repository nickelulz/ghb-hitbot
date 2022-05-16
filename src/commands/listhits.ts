import { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { hits, findPlayerById } from "../database";
import Hit from "../types/Hit";

const ListHits: Command = {
    name: "listhits",
    description: "List all currently placed hits",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content: string = "";
        const user = findPlayerById(interaction.user.id);

        if (!user)
            hits.forEach((hit: Hit, index: number) => {
                content += index + " - " + hit.toString + "\n";
            });
        else {
            hits.forEach((hit: Hit, index: number) => {
                content += index + " -  " + hit.toStringOptionalPlacer(user) + "\n";
            });
            content += "\n\`Make sure to register to place hits, remove hits, and claim hits...\`";
        }

        if (content.length == 0)
            content = "No hits are currently placed!";
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default ListHits;