import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import Server from "../../constants";

const ServerInfo: Command = {
    name: "serverinfo",
    description: "Returns all of the info on the server.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed()
            .setTitle("SERVER INFO")
            .setDescription(`Address: \`${Server.DNS}\`\nVersion: ${Server.Version}`);


        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ServerInfo;