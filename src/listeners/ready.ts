import { Client } from "discord.js";
import logger from '../logger'
import commands from '../commands'
import { load, save } from '../database'

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application)
            return;

        // Init database
        load();

        logger.info(`${client.user.username} is online`);
        await client.application.commands.set(commands);
    });
}; 