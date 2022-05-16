import { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";
import { players } from "../database";

const ListPlayers: Command = {
    name: "listplayers",
    description: "Lists all currently registered players",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content = "";

        for (let i = 0; i < players.length; i++)
            content += (i+1) + " ▸ " + players[i].ign + "\n";

        if (content === "")
            content = "❌ No players are currently registered on this discord bot.";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default ListPlayers;