import dotenv from 'dotenv';
import logger from './logger';

/**
 * The minimum price required to place a hit on someone in diamonds.
 * 
 * @type number
 * @constant
 */
export const MINIMUM_HIT_PRICE = 10;

/**
 * The amount of cooldown time for buffering between hiring each hit
 * in minutes. Default is 2 hours.
 * 
 * @type number
 * @constant
 */
export const HIRING_COOLDOWN = 120;

/**
 * The amount of cooldown time for buffering between contracting for
 * each hit in minutes. Default is 2 hours.
 * 
 * @type number
 * @constant
 */
export const CONTRACTING_COOLDOWN = 120;

/**
 * The amount of cooldown time for buffering between being targetted on
 * each hit in minutes. Default is 4 hours.
 * 
 * @type number
 * @constant
 */
export const TARGETING_COOLDOWN = 240;

/**
 * Whether or not the bot will attempt to automatically start the minecraft
 * server on startup.
 * 
 * @type boolean
 * @constant
 */
export const AUTO_START: boolean = false;

/**
 * Whether or not the bot will start in debug mode. Enables many debug
 * features of the discord bot such as outputting the parsed JSON in 
 * database.ts and logger debug messages.
 * 
 * @type boolean
 * @constant
 */
export const DEBUG_MODE: boolean = false;

/**
 * Whether or not players can place hits on themselves.
 * 
 * @type boolean
 * @constant
 */
export const SELF_HITS: boolean = false;

/**
 * Whether or not players can have multiple pending contracts at once.
 * 
 * @type boolean
 * @constant
 */
export const ALLOW_MULTIPLE_PENDING_CONTRACTS: boolean = true;






/**
 * DO NOT CONFIGURE BEYOND HERE,
 * EVERYTHING BELOW NEEDS TO BE CONFIGURED
 * IN .env
 */

// Load .env
const env = dotenv.config();
if (env.error)
        throw env.error;

// environment/private variables
export const BOT_TOKEN = process.env.BOT_TOKEN;
export const ADMIN_TOKEN: string = (process.env.ADMIN_TOKEN === undefined || process.env.ADMIN_TOKEN.trim() === "") ? noRootAdmin() : process.env.ADMIN_TOKEN;
const SERVER_PORT: number = (process.env.SERVER_PORT === undefined || process.env.SERVER_PORT.trim() === "") ? noPort() : Number(process.env.SERVER_PORT);
const SERVER_ADDRESS: string = (process.env.SERVER_ADDRESS === undefined || process.env.SERVER_ADDRESS.trim() === "") ? noAddress() : process.env.SERVER_ADDRESS;
const SERVER_PATH: string = (process.env.SERVER_PATH === undefined || process.env.SERVER_PATH.trim() === "") ? noPath() : process.env.SERVER_PATH;
const SERVER_VERSION = (process.env.SERVER_VERSION === undefined || process.env.SERVER_VERSION.trim() === "") ? noVersion() : process.env.SERVER_VERSION;
const SERVER_DNS = (process.env.SERVER_DNS === undefined || process.env.SERVER_DNS.trim() === "") ? noDNS() : process.env.SERVER_DNS;

/**
 * JSON object representing the Server,
 * packages up all of the data into 5
 * internal data fields: 'Port', 'Address',
 * 'Version', 'Path' and 'DNS'.
 * 
 * @type JSON
 * @constant
 */
const Server = {
    Port: SERVER_PORT,
    Address: SERVER_ADDRESS,
    Version: SERVER_VERSION,
    Path: SERVER_PATH,
    DNS: SERVER_DNS
}

export default Server;

/**
 * Warns that the Root Admin is not set in .env and returns a placeholder.
 * @returns {string} Default Root Admin Placeholder.
 */
function noRootAdmin(): string {
    logger.warn("No root admin set.");
    return "NONE";
}

/**
 * Warns that the PORT for the server is not set and sets the default port instead.
 * @returns {number} Default Minecaft Port (25565)
 */
function noPort(): number {
    logger.warn("Server PORT not set. Setting as default (25565)");
    return 25565;
}

/**
 * Errors that there the Server Address is not set in .env and returns a placeholder.
 * @returns {string} Default Server Address Placeholder. ("NONE")
 */
function noAddress(): string {
    logger.error("Server ADDRESS is not set.");
    return "NONE";
}

/**
 * Errors that the Server executable PATH is not set in .env and returns a placeholder.
 * @returns {string} Default Server Starting Path Placeholder ("NONE").
 */
function noPath(): string {
    logger.error("Server executable PATH not set.");
    return "NONE";
}

/**
 * Warns that the Server Version is not set in .env and returns a placeholder.
 * @returns {string} Default Server Version placeholder ("latest/implicit") 
 */
function noVersion() {
    logger.warn("Server VERSION not set.");
    return "latest/implicit";
}

/**
 * Warns that the Server DNS is not set in .env and returns the Server 
 * Address and the Server PORT as a placeholder.
 * @returns {string} Default Server DNS placeholder: SERVER_ADDRESS:SERVER_PORT
 */
function noDNS() {
    logger.warn("Server DNS not set. Using server PORT and ADDRESS.");
    return SERVER_ADDRESS + ":" + SERVER_PORT;
}