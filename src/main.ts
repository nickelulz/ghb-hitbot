// import DiscordJS, { Intents } from "discord.js";
// import dotenv from 'dotenv';
// import logger from './logger';

// dotenv.config();

// const bot = new DiscordJS.Client({
//     intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
// });

// bot.on('ready', () => {
//     logger.info(`Bot logged in successfully as ${bot.user.username}`);
// });

// bot.on('messageCreate', (message) => {
//     // prefix: ?
    
// });

// bot.login(process.env.TOKEN);

import { Client } from "discord.js";
import logger from "./logger";

logger.log("Bot is starting...");

const client = new Client({
    intents: []
});

logger.log(client.toString()); 