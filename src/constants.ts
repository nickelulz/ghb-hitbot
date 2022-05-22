import dotenv from 'dotenv';
import logger from './logger';
dotenv.config();

// public constants
export const MINIMUM_HIT_PRICE = 10; // in diamonds
export const HIRING_COOLDOWN = 120; // in minutes
export const TARGETING_COOLDOWN = 60; // in minutes

/**
 * DO NOT CONFIGURE BEYOND HERE,
 * EVERYTHING BELOW NEEDS TO BE CONFIGURED
 * IN .env
 */

// environment/private variables
export const BOT_TOKEN = process.env.TOKEN;
export const ADMIN_TOKEN: string = (process.env.ADMIN_TOKEN === undefined || process.env.ADMIN_TOKEN.trim() === "") ? noRootAdmin() : process.env.ADMIN_TOKEN; // me
const SERVER_PORT: number = (process.env.SERVER_PORT === undefined || process.env.SERVER_PORT.trim() === "") ? noPort() : Number(process.env.SERVER_PORT);
const SERVER_ADDRESS: string = (process.env.SERVER_ADDRESS === undefined || process.env.SERVER_ADDRESS.trim() === "") ? noAddress() : process.env.SERVER_ADDRESS;
const SERVER_PATH: string = (process.env.SERVER_PATH === undefined || process.env.SERVER_PATH.trim() === "") ? noPath() : process.env.SERVER_PATH;
const SERVER_VERSION = (process.env.SERVER_VERSION === undefined || process.env.SERVER_VERSION.trim() === "") ? noVersion() : process.env.SERVER_VERSION;
const SERVER_DNS = (process.env.SERVER_DNS === undefined || process.env.SERVER_DNS.trim() === "") ? noDNS() : process.env.SERVER_DNS;

const Server = {
    Port: SERVER_PORT,
    Address: SERVER_ADDRESS,
    Version: SERVER_VERSION,
    Path: SERVER_PATH,
    DNS: SERVER_DNS
}

export default Server;

function noRootAdmin() {
    logger.warn("No root admin set.");
    return "NONE";
}

function noPort() {
    logger.warn("Server PORT not set. Setting as default (25565)");
    return 25565;
}

function noAddress() {
    logger.error("Server ADDRESS is not set.");
    return "NONE";
}

function noPath() {
    logger.error("Server executable PATH not set.");
    return "NONE";
}

function noVersion() {
    logger.warn("Server VERSION not set.");
    return "latest/implicit";
}

function noDNS() {
    logger.warn("Server DNS not set. Using server PORT and ADDRESS.");
    return SERVER_ADDRESS + ":" + SERVER_PORT;
}