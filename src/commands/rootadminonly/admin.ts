import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { findPlayerByIGN, findPlayerById, save } from "../../database";
import { ADMIN_TOKEN, COMMAND_ERROR_MESSAGES } from "../../constants"
import logger from "../../logger";

const Admin: Command = {
    name: "admin",
    description: "Add new admin (requires *root admin* access)",
    type: "CHAT_INPUT",
    options: [
        {
            name: "mode",
            description: "give/remove",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: "ign",
            description: "The IGN of the user edit permissions (must be registered)",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const user = findPlayerById(interaction.user.id);
        const target = findPlayerByIGN(String(interaction.options.get("ign")?.value));
        const mode = String(interaction.options.get("mode")?.value);

        // User not registered/not found
        if (!user)
            response.setDescription(COMMAND_ERROR_MESSAGES.NOT_REGISTERED);

        // Target not registered/not found
        else if (!target)
            response.setDescription(COMMAND_ERROR_MESSAGES.PLAYER_NOT_FOUND);

        // User is not ROOT admin
        else if (!(user.isAdmin && user.discordId === ADMIN_TOKEN))
            response.setDescription(COMMAND_ERROR_MESSAGES.NOT_ROOT_ADMIN);
        
        else {
            switch (mode) {
                case "give": 
                {
                    if (target.isAdmin)
                        response.description = "❌ Your target is already an admin!";
        
                    // Success
                    else 
                    {
                        target.isAdmin = true;
                        logger.info(`User ${user.ign} gave administrator access to user ${target.ign}`);
                        response.setDescription(`✅ Successfully made user ${target.ign} an admin.`);
                        save();
                    }

                    break;
                }
    
                case "remove": 
                {
                    if (!target.isAdmin)
                        response.description = "❌ Your target is already not an admin!";

                    else
                    {
                        target.isAdmin = false;
                        logger.info(`User ${user.ign} revoked administrator access from user ${target.ign}`);
                        response.setDescription(`✅ Successfully revoked user ${target.ign}\'s admin access.`);
                        save();
                    }
                    break;
                }
    
                default: 
                {
                    response.setDescription('Your mode has to be either \'give\' or \'remove\'.');
                    break;
                }
            }
        }

        await interaction.followUp({
            embeds: [ response ]
        });
    }
}; 

export default Admin;