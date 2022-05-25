import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { players } from "../../database";

const ListRegisteredPlayers: Command = {
    name: "listregisteredplayers",
    description: "Lists all currently registered players",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed();
        embed.description = "";

        for (let i = 0; i < players.length; i++)
            embed.description += (i+1) + ": " + players[i].ign + "\n";

        if (embed.description === "")
            embed.description = "❌ No players are currently registered on this discord bot.";
        else
            embed.setTitle("PLAYERS");

        await interaction.followUp({
            ephemeral: true,
            embeds: [ embed ]
        });
    }
}; 

export default ListRegisteredPlayers;