import { Client, ClientOptions } from "discord.js";
import logger from "./logger";
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';
import { BOT_TOKEN } from './constants'

logger.info("Bot is starting...");

export const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);
client.login(BOT_TOKEN);