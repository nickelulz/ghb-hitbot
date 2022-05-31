import { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import { findPlayerById } from "../../database";
import { startServer, getServerStatus, serverCurrentlyRunning } from "../../server"
import Command from "../../types/Command";
import logger from "../../logger";
import { COMMAND_ERROR_MESSAGES } from "../../constants";

const Start: Command = {
    name: "start",
    description: "Starts the server. Requires admin access.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const user = findPlayerById(interaction.user.id);

        // User not registered/not found
        if (!user)
            response.description = COMMAND_ERROR_MESSAGES.NOT_REGISTERED;
        
        // User is not an admin
        else if (!user.isAdmin)
            response.description = COMMAND_ERROR_MESSAGES.NOT_ADMIN;

        // Attempt to start the server  
        else {
            const data = getServerStatus();

            // Server already online
            if (data.online)
                response.description = `❌ The server is already online! ${data.players.now} people are playing!`;

            else if (serverCurrentlyRunning)
                response.description = `❌ The server is already currently running! Please try again later, or contact the root administrator.`;

            // Server is offline, send start request
            else {
                logger.info(`User ${user.ign} has started the server. Attempting to start server process...`);
                response.description = "✅ Attempting to start the server!";
                startServer();
            }
        }

        await interaction.followUp({
            embeds: [ response ]
        });
    }
}; 

export default Start;
