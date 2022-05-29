import fs from 'fs'
import logger from './logger'
import Bounty from './types/Bounty'
import Contract from './types/Contract'
import Hit from './types/Hit'
import Player from './types/Player'
import { DEBUG_MODE } from './constants'
import { client } from './main'
import DiscordJS, { MessageEmbed } from 'discord.js'

/**
 * The list of hits represented in an array of Hit objects. 
 * @exports database.ts
 */
export const hits: Hit[] = [];
// The list of hits represented in an array of JSON objects. 
let hits_JSON: any[];

/**
 * The list of players represented in an array of Player objects. 
 * @exports database.ts
 */
export const players: Player[] = [];
// The list of players represented in an array JSON objects. 
let players_JSON: any[] = [];

/**
 * The list of claims that are currently awaiting verification in an array.
 * @exports database.ts
 */
export const pending_claims: Hit[] = [];
// The list of claims that are currently awaiting verification in JSON.
let pending_claims_JSON: any[] = [];

/**
 * The list of completed hits in an array.
 * @exports database.ts
 */
export const completed_hits: Hit[] = [];
// The list of completed hits in JSON
let completed_hits_JSON: any[] = [];

/**
 * Find a player from the database using a matching discord id.
 * @param {string} discordId The discord ID to match.
 * @returns {Player | false} The player that was found or false if not found.
 * @exports database.ts
 */
export function findPlayerById(discordId: string): Player | false {
    for (let i = 0; i < players.length; i++)
        if (players[i].discordId === discordId)
            return players[i];
    return false;
};

/**
 * Find a player from the database using a matching in-game name.
 * @param {string} ign The in-game name to match.
 * @returns {Player | false} The player that was found or false if not found.
 * @exports database.ts
 */
export function findPlayerByIGN(ign: string): Player | false {
    for (let i = 0; i < players.length; i++)
        if (players[i].ign == ign)
            return players[i];
    return false;
}

/**
 * Find a contract from the hit database by matching the placer and the contractor.
 * @param {Player} placer The player that placed the hit.
 * @param {Player} contractor The player that is being contracted for the hit.
 * @returns {Contract | false} The hit that was found or false if not found.
 * @exports database.ts
 */
export function findContract(placer: Player, contractor: Player): Contract | false {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(contractor) && (<Contract> hits[i]).placer.equals(placer))
            return (<Contract> hits[i]);
    return false;
}

/**
 * Find a bounty from the hit database by matching the placer and the target.
 * @param {Player} placer The player that placed the hit.
 * @param {Player} target The player that is being contracted for the hit.
 * @returns {Bounty | false} The hit that was found or false if not found.
 * @exports database.ts
 */
export function findBounty(placer: Player, target: Player): Bounty | false {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Bounty && hits[i].placer.equals(placer) && hits[i].target.equals(target))
            return hits[i];
    return false;
}

/**
 * Finds a hit by matching only the target.
 * @param {Player} placer The player that placed the hit.
 * @returns {Hit | false} The first hit that was found or false if not found.
 * @exports database.ts
 */
export function findHitByTarget(target: Player): Hit | false {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(target))
            return hits[i];
    return false;
}

/**
 * Checks if a player is currently a target for a hit.
 * @param {Player} player The player to search for.
 * @returns {boolean} Whether or not the player is currently being targeted by a hit.
 * @exports database.ts
 */
export function isTarget(player: Player): boolean {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(player))
            return true;
    return false;
}

/**
 * Checks if a player is currently a contractor.
 * @param {Player} player The player to search for. 
 * @returns {boolean} Whether or not the player is currently a contractor for a hit.
 * @exports database.ts
 */
export function isContractor(player: Player): boolean {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(player) && !(<Contract> hits[i]).pending)
            return true;
    return false;
}

/**
 * Checks if a player currently has a placed hit on someone.
 * @param {Player} player The player to search for. 
 * @returns {boolean} Whether or not the player currently is a hirer for a hit on somebody.
 * @exports database.ts
 */
export function isHirer(player: Player): boolean {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].placer.equals(player))
            return true;
    return false;
}

/**
 * Removes all of this hits of a player.
 * @param {Player} player The player to remove all of the hits off of.
 * @exports database.ts
 */
export function removeAllHits(player: Player): void {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(player) || hits[i].placer.equals(player) || (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(player)))
            hits.splice(i, 1);
}

/**
 * Loads all databases - hits, completed_hits, players, and pending counterclaims.
 * @exports database.ts
 */
export function load() {
    fs.readFile(__dirname + '/databases/players.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }

        players_JSON = JSON.parse(raw);

        if (DEBUG_MODE) {
            logger.debug("Dumping player JSON.");
            console.log(players_JSON);
        }

        if (players_JSON === undefined || String(players_JSON) === "undefined")
            logger.error("Paring Error. players_JSON is undefined! (@63-database.ts)");

        for (let i = 0; i < players_JSON.length; i++) {
            const discordId: string = players_JSON[i]["discordId"];
            const ign: string = players_JSON[i]["ign"];
            const lastPlacedHit: string = players_JSON[i]["lastPlacedHit"];
            const lastTargetedHit: string = players_JSON[i]["lastTargetedHit"];
            const lastContractedHit: string = players_JSON[i]["lastContractedHit"];
            const killCount: number = players_JSON[i]["killCount"];
            const deathCount: number = players_JSON[i]["deathCount"];
            const isAdmin: boolean = players_JSON[i]["isAdmin"];
            players.push(new Player(discordId, ign, lastPlacedHit, lastTargetedHit, lastContractedHit, killCount, deathCount, isAdmin));
        }
        logger.info('Loaded current player database.');
    });

    fs.readFile(__dirname + '/databases/hits.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err + " (@79-database.ts)");
            return;
        }

        hits_JSON = JSON.parse(raw);

        if (DEBUG_MODE) {
            logger.debug('Dumping hits JSON.');
            console.log(hits_JSON);
        }

        if (hits_JSON === undefined || String(hits_JSON) === "undefined")
            logger.error("Paring Error. hits_JSON is undefined!");

        parseJSONToArray(hits_JSON, hits);
        logger.info('Loaded current hit database.');
    });

    fs.readFile(__dirname + '/databases/pending_claims.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }

        pending_claims_JSON = JSON.parse(raw);

        if (DEBUG_MODE) {
            logger.debug("Dumping pending counterclaims JSON.");
            console.log(pending_claims_JSON);
        }

        if (pending_claims_JSON === undefined || String(pending_claims_JSON) === "undefined")
            logger.error("Paring Error. pending_claims_JSON is undefined!");
        
        parseJSONToArray(pending_claims_JSON, pending_claims);
        logger.info("Loaded current pending counterclaims JSON");
    });

    fs.readFile(__dirname + '/databases/completed_hits.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }

        completed_hits_JSON = JSON.parse(raw);

        if (DEBUG_MODE) {
            logger.debug("Dumping completed hits JSON.");
            console.log(completed_hits_JSON);
        }

        parseJSONToArray(completed_hits_JSON, completed_hits);
        logger.info("Loaded current completed hits JSON");
    });
}

/**
 * DM's a player a message on discord.
 * @param {Player} user The user to message.
 * @param {MessageEmbed} message The message to be sent to the user. 
 */
export function dm_user(user: Player, message: MessageEmbed): void {
    // DM hirer with contractor response
    Promise.resolve(client.users.fetch(user.discordId)).then((user_discord: DiscordJS.User | undefined) => {
        if (user_discord === undefined)
            logger.error(`User ${user.ign} has an invalid discord ID not found in bot cache.`);
        else {
            try {
                user_discord.send({ embeds: [ message ] });
            }
            catch (err: any) {
                logger.warn(`Cannot message user ${user.ign}.`);
            }
        }
    });
}

/**
 * Parses a JSON array and outputs it to a Hit array.
 * @param {JSON[]} json The JSON array to parse from.
 * @param {Hit[]} out The Hit array to output to.
 */
function parseJSONToArray(json: any[], out: Hit[]) {
    for (let i = 0; i < json.length; i++) {
        const placer = findPlayerByIGN(json[i]["placer"]);
        const target = findPlayerByIGN(json[i]["target"]);
        const price: number = Number(json[i]["price"]);
        const datePlaced: Date = new Date(json[i]["datePlaced"]);
        const dateClaimed: Date | undefined = (json[i]["dateClaimed"] === "none") ? undefined : new Date(json[i]["dateClaimed"]);
        const type: string = json[i]["type"];
        if (!placer)
            logger.error(`Invalid hit JSON at index ${i}. Placer ${json[i]["placer"]} not found in registry.`);
        else if (!target)
            logger.error(`Invalid hit JSON at index ${i}. Target ${json[i]["target"]} not found in registry.`);
        else {
            switch (type) {
                case "bounty":
                    out.push(new Bounty(placer, target, price, datePlaced, dateClaimed));
                    break;
                case "contract":
                    const contractor = findPlayerByIGN(json[i]["contractor"]);
                    const pending = Boolean(json[i]["pending"]);
                    if (!contractor)
                        logger.error(`Invalid contracted hit JSON at hit ${i}. Contractor ${json[i]["contractor"]} not found in registry.`);
                    else
                        out.push(new Contract(placer, target, price, datePlaced, contractor, pending, dateClaimed));
                    break;
            }
        }
    }
}

/**
 * Syncs all of the JSON arrays to
 * their alternative regular arrays.
 */
function syncJSON() {
    // Clear Arrays
    hits_JSON.length = 0;
    players_JSON.length = 0;
    pending_claims_JSON.length = 0;
    completed_hits_JSON.length = 0;

    // Copy from player arrays to player JSON arrays 
    for (let i = 0; i < players.length; i++)
        players_JSON.push(players[i].toJSON);
    // Copy from hit array to hit JSON array
    for (let i = 0; i < hits.length; i++)
        hits_JSON.push(hits[i].toJSON);
    // Copy from pending counterclaims array to pending counterclaims JSON array
    for (let i = 0; i < pending_claims.length; i++)
        pending_claims_JSON.push(pending_claims[i].toJSON);
    // Copy from completed hits array to completed hits JSON array
    for (let i = 0; i < completed_hits.length; i++)
        completed_hits_JSON.push(completed_hits[i].toJSON);
}


/**
 * Synchronizes and writes the data on the three database arrays
 * (players, hits, completed_hits) to each database file.
 * @exports database.ts
 */
export function save() {
    syncJSON();

    fs.writeFile(__dirname + '/databases/hits.json', JSON.stringify(hits_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });

    fs.writeFile(__dirname + '/databases/players.json', JSON.stringify(players_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });

    fs.writeFile(__dirname + '/databases/pending_claims.json', JSON.stringify(pending_claims_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });

    fs.writeFile(__dirname + '/databases/completed_hits.json', JSON.stringify(completed_hits_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });

    logger.info('Saved all databases.');
}