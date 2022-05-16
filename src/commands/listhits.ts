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

        for (let i = 0; i < hits.length; i++)
            content += i + " ▸ " + hits[i].toString + "\n";

        if (content.length == 0)
            content = "❌ No hits are currently placed!";

        if (!user)
            content += "\n\n\`Make sure to register to place hits, remove hits, and claim hits...\`";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default ListHits;