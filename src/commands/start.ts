import { BaseCommandInteraction, Client } from "discord.js";
import { findPlayerById } from "../database";
import Server from "../constants";
import { spawn } from 'child_process'
import { getServerStatus } from "../server";
import Command from "../types/Command";
import logger from "../logger";

const Start: Command = {
    name: "start",
    description: "Starts the server. Requires admin access.",
    type: "CHAT_INPUT",
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        let content = "";
        const user = findPlayerById(interaction.user.id);
        let executable;

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

            // Server is offline, send start request
            else {
                logger.info(`User ${user.ign} has started the server. Attempting to start server process...`);
                executable = spawn(Server.Path);
                executable.stdout.on('data', (data: any) => {
                    logger.info('[SERVER] ' + data);
                    content = "✅ Started the server!"
                });
                executable.stderr.on('data', (data: any) => {
                    logger.error('[SERVER] ' + data);
                    content = "❌ Could not start the server. :(";
                });
                executable.on('close', (code) => {
                    logger.error('[SERVER] Server executable closed with exit code ' + code);
                });
            }
        }

        await interaction.followUp({
            content
        });
    }
}; 

export default Start;