import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";

const RespondContract: Command = {
    name: "respondcontract",
    description: "Respond (accept/deny) to a contract.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The in-game name of the person who is attempting to hire you for a contract.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "choice",
            description: "accept/deny",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("😀 Hello there!");

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default RespondContract;