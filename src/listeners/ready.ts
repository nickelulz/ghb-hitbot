import { Client } from "discord.js";
import logger from '../logger'
import commands from '../commands'
import { load } from '../database'
import { getServerStatus } from "../server";

export default (client: Client): void => {
    client.on("ready", async () => {
        if (!client.user || !client.application)
            return;

        // Init database
        load();

        function randomMOTD() {
            const motds: string[] = [
                "Bruce really is a goat.",
                "Mufaro >>>>",
                "ILY PABLO!!",
                "Don\'t kill Zach\'s sheep.",
                "Have fun!"
            ];

            return motds[Math.floor(Math.random() * motds.length)];
        }

        client.user.setActivity(randomMOTD());

        logger.info(`${client.user.username} is online.`);
        await client.application.commands.set(commands);

        // Init data
        getServerStatus();
    });
}; 