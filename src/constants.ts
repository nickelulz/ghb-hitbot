import dotenv from 'dotenv';
import logger from './logger';

/**
 * The minimum price required to place a hit on someone in diamonds.
 * 
 * @type number
 * @constant
 */
export const MINIMUM_HIT_PRICE: number = 10;

/**
 * The amount of cooldown time for buffering between hiring each hit
 * in minutes. Default is 2 hours.
 * 
 * @type number
 * @constant
 */
export const HIRING_COOLDOWN: number = 120;

/**
 * The amount of cooldown time for buffering between contracting for
 * each hit in minutes. Default is 2 hours.
 * 
 * @type number
 * @constant
 */
export const CONTRACTING_COOLDOWN: number = 120;

/**
 * The amount of cooldown time for buffering between being targetted on
 * each hit in minutes. Default is 4 hours.
 * 
 * @type number
 * @constant
 */
export const TARGETING_COOLDOWN: number = 240;

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
 * Default "image not found"/Error 404 Image URL for embeds and whatnot.
 * 
 * @type string
 * @constant
 */
export const NOT_FOUND_IMG_URL: string = "https://media.istockphoto.com/vectors/error-document-icon-vector-id1062127004?k=6&m=1062127004&s=612x612&w=0&h=94D4dEDZzXuNQ0rhw7yftXb259wNpjDMoNmcl9KvUD8="; 

/**
 * Command error messages used to edit messages across several commands.
 * @type JSON
 * @constant
 */
export const COMMAND_ERROR_MESSAGES = {
    /**
     * User is not registered with the bot, and command requires registry.
     */
    NOT_REGISTERED: "??? You are not a registered user! Use \`/register\` to register to use this command!",

    /**
     * User is not an administrator, and command requires administrator permissions.
     */
    NOT_ADMIN: "??? This command requires administrator permissions, and you aren'\t an admin.",

    /**
     * User is not the root administrator, and this command requires root administrator level permissions.
     */
    NOT_ROOT_ADMIN: "??? You are not the **root** admin! (Only the bot configuration manager has root access!)",

    /**
     * Price field is undefined.
     */
    NO_PRICE: "??? You must set a price.",

    /**
     * Set price (for placing a hit) is too low. (Less than MINIMUM_HIT_PRICE)
     */
    PRICE_TOO_LOW: `??? Price is too low! *The Minimum price for a hit is ${MINIMUM_HIT_PRICE} diamonds.*`,

    /**
     * Target field is undefined.
     */
    NO_TARGET: "??? You must set a target.",

    /**
     * Target (of hit) is not found in registry.
     */
    TARGET_NOT_FOUND: "??? The target was not found in the player registry. Make sure you are spelling the name correctly, with correct capitalization.",

    /**
     * Target (of hit) already has a hit placed on them.
     */
    TARGET_BUSY: "??? Your target is currently under the effect of a hit! Wait until 1 hour after that hit is completed.",

    /**
     * Target for a placed hit is the placer themself.
     */
    TARGET_IS_SELF: "??? You cannot place a hit on yourself! *(unless you\'re into that sort of thing...)*",

    /**
     * Hirer of a hit already has an active hit placed on another player.
     */
    HIRER_BUSY: "??? You already have an active hit out on someone. You cannot have two hits at once.",

    /**
     * Bounty is not found in registry.
     */
    BOUNTY_NOT_FOUND: "??? The bounty you intend to remove was not found. Make sure that you are matching the players correctly, and check with \`/listbounties\`. Alternatively, you might have already removed it. :)",

    /**
     * Hirer field is undefined.
     */
    NO_HIRER: "??? You have to specify the hirer.",

    /**
     * Hirer of a hit is not registered/not found in player registry.
     */
    HIRER_NOT_FOUND: "??? The hirer of this hit is not a registered user. (And therefore, not found in the registry.)",

    /**
     * Claimer of a hit is the target of the hit (on commands that are not /counterclaim.)
     */
    CLAIMER_IS_TARGET: "??? You cannot claim a hit on yourself this way. To claim hits placed against you, use \`/counterclaim\`",

    /**
     * Claimer of a hit is the placer.
     */
    CLAIMER_IS_HIRER: "??? You cannot claim your own hit.",

    /**
     * Contractor field is undefined.
     */
    NO_CONTRACTOR: "??? You have to set a contractor!",

    /**
     * Contractor is not found in player registry.
     */
    CONTRACTOR_NOT_FOUND: "??? The contractor was not found in the registry. Make sure you are spelling their name correctly, otherwise they are not a registered user.",

    /**
     * Contractor of hit is the target of the hit.
     */
    CONTRACTOR_IS_TARGET: "??? The contractor cannot be the target.",

    /**
     * Contractor of hit already has an active contract.
     */
    CONTRACTOR_BUSY: "??? Your contractor already has an active contract!",

    /**
     * Contract is not found in hit database.
     */
    CONTRACT_NOT_FOUND: "??? The contract you intend to remove was not found. Make sure that you are matching the players correctly, and check with \`/listbounties\`. Alternatively, you might have already removed it. :)",

    /**
     * Player not found in player database.
     */
    PLAYER_NOT_FOUND: "??? The player you selected was not found in the registry. Make sure you spelled the name correctly with correct capitalization.",
}

const SERVER_RULES: string = '**Rules (and other non-rules):**\n' +
'1. No hacking/cheating. (No illegal game modifications. You can use any of these mods, though: *Litematica, Optifine, ShulkerboxTooltips, Badlion, Lunar, MiniHud* or etc. Just ask if you aren\'t sure. No XRay.\n\n' +
'2. No griefing or stealing.\n\n' + 
'3. Don\'t exploit bugs in the hit system. Use it as intended.\n\n' +
'4. If you find the end portal, you have to share the coordinates and you can\'t fight the dragon until everyone agrees to it. You can have all of the loot in the stronghold, though.\n\n' +
'5. No conspiring with others to gang up on hits. Hits are meant to be 1v1 fair fights each time.\n\n' +
'6. Once the ender dragon is defeated, the seed is released and you can use ChunkBase and etc as much as you\'d like. These services are banned prior to this.\n\n' +
'7. Breaking the rules of the server is punishable by just light court sentences (paying diamonds, usually) for small stuff (like hit or land disputes) and getting banned from this server and future servers for big stuff (server wide grief)\n\n' +
'8. People have a land claim (as in they control everything from bedrock to build limit) within 200 blocks radius of their base. This only applies if they are not within the 300 block radius of spawn, however. This also doesn\'t apply if they specifically state the borders of their base.';

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
export const Server = {
    Port: SERVER_PORT,
    Address: SERVER_ADDRESS,
    Version: SERVER_VERSION,
    Path: SERVER_PATH,
    DNS: SERVER_DNS,
    Rules: SERVER_RULES
}

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