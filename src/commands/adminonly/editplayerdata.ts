import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { COMMAND_ERROR_MESSAGES } from "../../constants";
import { findPlayerById, findPlayerByIGN, save } from "../../database";
import Command from "../../types/Command";

const EditPlayerData: Command = {
    name: "editplayerdata",
    description: "Edit either the kills or the deaths of a user. Requires administrator permissions.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "ign",
            description: "The IGN of the user to be changed",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "mode",
            description: "kills/deaths",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "newvalue",
            description: "The new amount to set the user\'s hit kills/deaths to.",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const user = findPlayerById(interaction.user.id);
        const player = findPlayerByIGN(String(interaction.options.get("ign")?.value));
        const amount = Number(interaction.options.get("amount")?.value);
        const mode = String(interaction.options.get("mode")?.value);
        const response = new MessageEmbed();
        
        // User not registered/not found
        if (!user)
            response.setDescription(COMMAND_ERROR_MESSAGES.NOT_REGISTERED);

        // player not registered/not found
        else if (!player)
            response.setDescription(COMMAND_ERROR_MESSAGES.PLAYER_NOT_FOUND);
        
        // User is not an admin
        else if (!user.isAdmin)
            response.setDescription(COMMAND_ERROR_MESSAGES.NOT_ADMIN);

        // Successful
        else {
            switch (mode) 
            {
                case "kills": 
                {
                    player.killCount = amount;
                    response.setDescription(`✅ Set user ${player.ign}\'s kills to ${amount}`);
                    break;
                }

                case "deaths":
                {
                    player.deathCount = amount;
                    response.setDescription(`✅ Set user ${player.ign}\'s deaths to ${amount}`);
                    break;
                }

                default: 
                {
                    response.setDescription('Your mode has to be either \'kills\' or \'deaths\'.');
                    break;
                }
            }

            save();
        }

        await interaction.followUp({
            embeds: [ response ]
        });
    }
}; 

export default EditPlayerData;