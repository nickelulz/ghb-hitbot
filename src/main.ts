import { Client, ClientOptions } from "discord.js";
import logger from "./logger";
import ready from './listeners/ready';
import interactionCreate from './listeners/interactionCreate';
import dotenv from 'dotenv'
dotenv.config()

logger.info("Bot is starting...");

export const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);
client.login(process.env.TOKEN);