import DiscordJS, { BaseCommandInteraction, Client, MessageEmbed } from "discord.js";
import Command from "../../types/Command";
import { Server, COMMAND_ERROR_MESSAGES } from "../../constants";
import { getServerStatus, serverCurrentlyRunning, startServer } from "../../server";
import { findPlayerById } from "../../database";
import logger from "../../logger";

const ServerCommand: Command = {
    name: "server",
    description: "The blanket command for everything having to deal with the server.",
    type: "CHAT_INPUT",
    options: [
        {
            name: "mode",
            description: "status/info/start",
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    run: async (client: Client, interaction: BaseCommandInteraction) => {
        const response = new MessageEmbed();
        const mode = String(interaction.options.get("mode")?.value);

        switch (mode) {
            case 'status': 
            {
                const data = getServerStatus();
                response.setTitle("STATUS").setDescription((data.online) ? "The server is *online*" : "The server is *offline*");

                if (data.online) {
                    response.description += `\n\nPlayers: ${data.players.online}/${data.players.max} players online.\n`;
                    if ('players' in data && 'list' in data.players)
                        for (let i = 0; i < data.players.list.length; i++)
                            response.description += data.players.list[i] + "\n";
                }
                break;
            }

            case 'info':
            {
                response.setTitle("SERVER INFO").setDescription(`Address: \`${Server.DNS}\`\nVersion: ${Server.Version}\n\n` + Server.Rules);
                break;
            }

            case 'start':
            {
                const user = findPlayerById(interaction.user.id);
                const data = getServerStatus();

                if (!user)
                    response.setDescription(COMMAND_ERROR_MESSAGES.NOT_REGISTERED)
                else if (!user.isAdmin)
                    response.setDescription(COMMAND_ERROR_MESSAGES.NOT_ADMIN)
                else if (data.online)
                    response.setDescription(`❌ The server is already online! ${data.players.now} people are playing!`);
                else if (serverCurrentlyRunning)
                    response.setDescription(`❌ The server is already currently running! Please try again later, or contact the root administrator.`);
                else {
                    logger.info(`User ${user.ign} has started the server. Attempting to start server process...`);
                    response.description = "✅ Attempting to start the server!";
                    startServer();
                }
                break;
            }
        }

        await interaction.followUp({
            ephemeral: true,
            embeds: [ response ]
        });
    }
}; 

export default ServerCommand;