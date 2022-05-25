import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { getServerStatus } from "../../server";

const ListOnlinePlayers: Command = {
    name: "listonlineplayers",
    description: "Lists all of the currently online players",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed();

        const data: any = getServerStatus();
        if (!data.online)
            embed.setDescription("No players are currently online.");
        else {
            embed.setTitle("PLAYERS");
            embed.setDescription(`${data.players.online}/${data.players.max} players online.\n\n`);
            if ('list' in data.players)
                for (let i = 0; i < data.players.list.length; i++)
                    embed.description += data.players.list[i] + "\n";
            else
                embed.description += "Player list unavailable. Too many online!";
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ embed ]
        });
    }
}; 

export default ListOnlinePlayers;