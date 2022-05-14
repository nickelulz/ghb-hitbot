import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/types/Command";
import { hits } from "src/database";
import Hit from "src/types/Hit";

export const ListHits: Command = {
    name: "listhits",
    description: "List all currently placed hits",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content: string = "";
        hits.forEach((hit: Hit, index: number) => {
            content += index + " " + hit.toString;
        });
        if (content.length == 0)
            content = "No hits are currently placed!";
        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 