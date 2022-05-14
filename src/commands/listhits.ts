import { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/command";
import HitList from "src/database";
import Hit from "src/Hit";

export const ListHits: Command = {
    name: "listhits",
    description: "List all currently placed hits",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content: string = "";
        HitList.forEach((hit: Hit, index: number) => {
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