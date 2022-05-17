import { BaseCommandInteraction, Client } from "discord.js";
import Command from "../types/Command";

const Help: Command = {
    name: "help",
    description: "Lists all of the commands that this bot has.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const content = 
        "\`COMMANDS\`\n" +
        "▸ /help\n" +
        "▸ /hello\n" +
        "▸ /listplayers\n" +
        "▸ /listhits\n" +
        "▸ /listplayers\n" +
        "▸ /register\n" +
        "▸ */placehit*\n" +
        "▸ */claimhit*\n" +
        "▸ */removehit*\n"
        "\n\`(💡 all bolded commands require you to be registered)\`";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
}; 

export default Help;