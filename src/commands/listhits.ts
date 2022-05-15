import { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { hits } from "../database";
import Hit from "../types/Hit";

const ListHits: Command = {
    name: "listhits",
    description: "List all currently placed hits",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content: string = "";
        hits.forEach((hit: Hit, index: number) => {
            content += index + " " + hit.toString + "\n";
        });

        if (content.length == 0)
            content = "No hits are currently placed!";
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default ListHits;