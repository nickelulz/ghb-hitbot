import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { getServerStatus } from "../../server";

const ListOnlinePlayers: Command = {
    name: "listonlineplayers",
    description: "Lists all of the currently online players",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();

        const data: any = getServerStatus();
        if (!data.online)
            response.setDescription("👍 No players are currently online.");
        else {
            response.setTitle("PLAYERS");
            response.setDescription(`${data.players.online}/${data.players.max} players online.\n\n`);
            if ('list' in data.players)
                for (let i = 0; i < data.players.list.length; i++)
                    response.description += data.players.list[i] + "\n";
            else
                response.description += "Player list unavailable. Too many online!";
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ListOnlinePlayers;