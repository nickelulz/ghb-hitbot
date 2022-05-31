import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { findPlayerById, save } from "../../database";
import Command from "../../types/Command";
import { COMMAND_ERROR_MESSAGES } from "../../constants";

const ChangeIGN: Command = {
    name: "changeign",
    description: "Change your in-game name. (Requires you to be registered)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "newign",
            description: "The new IGN to set yourself to.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed().setDescription("😀 Hello there!");
        const newIGN: string = String(interaction.options.get("newign")?.value);
        const user = findPlayerById(interaction.user.id);

        if (!user)
            response.setDescription(COMMAND_ERROR_MESSAGES.NOT_REGISTERED);

        else {
            const oldIGN = user.ign;
            user.ign = newIGN;
            response.setDescription(`✅ Changed your IGN from ${oldIGN} to ${newIGN}`);
            save();
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ChangeIGN;