import { BaseCommandInteraction, Client } from "discord.js";
import { findPlayerById } from "../database";
import { startServer, getServerStatus, serverCurrentlyRunning } from "../server"
import Command from "../types/Command";
import logger from "../logger";

const Start: Command = {
    name: "start",
    description: "Starts the server. Requires admin access.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content = "";
        const user = findPlayerById(interaction.user.id);

        // User not registered/not found
        if (!user)
            content = "❌ You are not a registered user! (make sure to use \`/register\` to register!)";
        
        // User is not an admin
        else if (!user.isAdmin)
            content = "❌ You are not an admin!";

        // Attempt to start the server  
        else {
            const data = getServerStatus();

            // Server already online
            if (data.online)
                content = `❌ The server is already online! ${data.players.now} people are playing!`;

            else if (serverCurrentlyRunning)
                content = `❌ The server is already currently running! Please try again later, or contact the root administrator.`;

            // Server is offline, send start request
            else {
                logger.info(`User ${user.ign} has started the server. Attempting to start server process...`);
                content = "✅ Attempting to start the server!";
                startServer();
            }
        }

        await interaction.followUp({
            content
        });
    }
}; 

export default Start;
