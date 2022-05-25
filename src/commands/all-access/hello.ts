import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";

const Hello: Command = {
    name: "hello",
    description: "Returns a greeting",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const embed = new MessageEmbed().setDescription("😀 Hello there!");

        await interaction.followUp({
            ephemeral: true,
            embeds: [ embed ]
        });
    }
}; 

export default Hello;