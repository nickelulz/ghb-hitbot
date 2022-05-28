import fs from 'fs'
import logger from './logger'
import Bounty from './types/Bounty'
import Contract from './types/Contract'
import Hit from './types/Hit'
import Player from './types/Player'
import { DEBUG_MODE } from './constants'

/* The list of hits represented in an array of JSON objects. */
let hits_JSON: any[];
/* The list of hits represented in an array of Hit objects. */
export let hits: Hit[] = [];

/* The list of players represented in an array JSON objects. */
let players_JSON: any[];
/* The list of players represented in an array of Player objects. */
export let players: Player[] = [];

/**
 * Find a player from the database using a matching discord id.
 * @param {string} discordId The discord ID to match.
 * @returns {Player | false} The player that was found or false if not found.
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
 */
export function findPlayerByIGN(ign: string): Player | false {
    for (let i = 0; i < players.length; i++)
        if (players[i].ign === ign)
            return players[i];
    return false;
}

/**
 * Find a contract from the hit database by matching the placer and the contractor.
 * @param {Player} placer The player that placed the hit.
 * @param {Player} contractor The player that is being contracted for the hit.
 * @returns {Contract | false} The hit that was found or false if not found.
 */
export function findContract(placer: Player, contractor: Player): Contract | false {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(contractor) && (<Contract> hits[i]).placer.equals(placer))
            return (<Contract> hits[i]);
    return false;
}

/**
 * Checks if a player is currently a target for a hit.
 * @param {Player} player The player to search for.
 * @returns {boolean} Whether or not the player is currently being targeted by a hit.
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
 */
export function isContractor(player: Player): boolean {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(player))
            return true;
    return false;
}

/**
 * Removes all of this hits of a player.
 * @param {Player} player The player to remove all of the hits off of.
 */
export function removeAllHits(player: Player): void {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(player) || hits[i].placer.equals(player) || (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(player)))
            hits.splice(i, 1);
}

/**
 * Loads all databases - hits, completed_hits, players.
 */
export function load() {
    fs.readFile(__dirname + '/databases/players.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err + "(@58-database.ts)");
            return;
        }

        players_JSON = JSON.parse(raw);

        if (DEBUG_MODE) {
            logger.info("Dumping player JSON.");
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
            logger.info('Dumping hits JSON.');
            console.log(hits_JSON);
        }

        if (hits_JSON === undefined || String(hits_JSON) === "undefined")
            logger.error("Paring Error. hits_JSON is undefined! (@86-database.ts)");

        for (let i = 0; i < hits_JSON.length; i++) {
            const placer = findPlayerByIGN(hits_JSON[i]["placer"]);
            const target = findPlayerByIGN(hits_JSON[i]["target"]);
            const price: number = Number(hits_JSON[i]["price"]);
            const datePlaced: Date = new Date(hits_JSON[i]["datePlaced"]);
            const type: string = hits_JSON[i]["type"];
            if (!placer)
                logger.error(`Invalid hit JSON at index ${i}. Placer ${hits_JSON[i]["placer"]} not found in registry. (@92-database.ts)`);
            else if (!target)
                logger.error(`Invalid hit JSON at index ${i}. Target ${hits_JSON[i]["target"]} not found in registry. (@92-database.ts)`);
            else {
                switch (type) {
                    case "bounty":
                        hits.push(new Bounty(placer, target, price, datePlaced));
                        break;
                    case "contract":
                        const contractor = findPlayerByIGN(hits_JSON[i]["contractor"]);
                        const publicity = hits_JSON[i]["publicity"];
                        const pending = Boolean(hits_JSON[i]["pending"]);
                        if (!contractor)
                            logger.error(`Invalid contracted hit JSON at hit ${i}. Contractor ${hits_JSON[i]["contractor"]} not found in registry. (@103-database.ts)`);
                        else
                            hits.push(new Contract(placer, target, price, datePlaced, contractor, publicity, pending));
                        break;
                }
            }
        }
        logger.info('Loaded current hit database.')
    });
}

/**
 * Syncs all of the JSON arrays to
 * their alternative regular arrays.
 */
function syncJSON() {
    // Clear Arrays
    hits_JSON.length = 0;
    players_JSON.length = 0;

    // Copy from player arrays to player JSON arrays 
    for (let i = 0; i < players.length; i++)
        players_JSON.push(players[i].toJSON);
    // Copy from hit array to hit JSON array
    for (let i = 0; i < hits.length; i++)
        hits_JSON.push(hits[i].toJSON);
}


/**
 * Synchronizes and writes the data on the three database arrays
 * (players, hits, completed_hits) to each database file.
 */
export function save() {
    syncJSON();

    fs.writeFile(__dirname + '/databases/hits.json', JSON.stringify(hits_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err + " (@131-database.ts)");
            return;
        }
    });

    fs.writeFile(__dirname + '/databases/players.json', JSON.stringify(players_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err + " (@138-database.ts)");
            return;
        }
    });
}