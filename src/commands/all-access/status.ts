import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { getServerStatus } from "../../server";

const Status: Command = {
    name: "status",
    description: "Check the status of the minecraft server",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const data = getServerStatus();
        const response = new MessageEmbed()
            .setTitle("STATUS")
            .setDescription((data.online) ? "The server is *online*" : "The server is *offline*");

        if (data.online) {
            response.description += `\n\nPlayers: ${data.players.online}/${data.players.max} players online.\n`;
            if ('players' in data && 'list' in data.players)
                for (let i = 0; i < data.players.list.length; i++)
                    response.description += data.players.list[i] + "\n";
        }

        await interaction.followUp({
            embeds: [ response ]
        });
    }
}; 

export default Status;