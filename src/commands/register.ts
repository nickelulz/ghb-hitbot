import DiscordJS, { BaseCommandInteraction, Client } from "discord.js";
import { Command } from "src/types/Command";

export const Register: Command = {
    name: "register",
    description: "Register as a player (to link your discord to the server)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "Your In-Game Name",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const { options } = interaction;
        let content: string = "";
        

        await interaction.followUp({
            content
        });
    }
}; 