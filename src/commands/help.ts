import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../types/Command";

const Help: Command = {
    name: "help",
    description: "Lists all of the commands that this bot has.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed()
        .setTitle("COMMANDS")
        .setDescription(
            "▸ /help\n" +
            "▸ /hello\n" +
            "▸ /listplayers\n" +
            "▸ /listhits\n" +
            "▸ /listplayers\n" +
            "▸ /register\n" +
            "▸ /status\n" +
            "▸ /serverinfo\n" +
            "▸ */placehit*\n" +
            "▸ */claimhit*\n" +
            "▸ */removehit*\n" +
            "▸ */deregister*\n" +
            "▸ **/start**\n" +
            "▸ **/setkills**\n" +
            "▸ **/setdeaths**\n" +
            "▸ \`admin\`\n" +
            "▸ \`de-admin\`\n" +
            "\n\`(💡 all slanted commands require you to be registered)\`" +
            "\n\`(💡 all bolded commands require you to be an admin)\`" + 
            "\n\`(💡 all special commands require you to be the root admin)\`"
        );

        await interaction.followUp({
            ephemeral: true,
            embeds: [ embed ]
        });
    }
}; 

export default Help;