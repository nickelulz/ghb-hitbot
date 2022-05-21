import dotenv from 'dotenv';
dotenv.config();

// environment/private variables
export const BOT_TOKEN = process.env.TOKEN;
export const ADMIN_TOKEN = (process.env.ADMIN_TOKEN === undefined) ? "NULL" : process.env.ADMIN_TOKEN; // me
export const SERVER_PORT = (process.env.SERVER_PORT === undefined) ? 25565 : Number(process.env.PORT);
export const SERVER_ADDRESS = (process.env.SERVER_ADDRESS === undefined) ? "NULL" : process.env.SERVER_ADDRESS;

// public constants
export const SERVER_VERSION = "[version placeholder]";
export const MINIMUM_HIT_PRICE = 10; // in diamonds
// in minutes
export const HIRING_COOLDOWN = 120; 
export const TARGETING_COOLDOWN = 60;