import fs from 'fs'
import logger from './logger'
import Hit from './types/Hit'
import Player from './types/Player'

let hits_JSON: any[];
export let hits: Hit[] = [];

let players_JSON: any[];
export let players: Player[] = [];

export function findPlayerById(discordId: string) {
    for (let i = 0; i < players.length; i++)
        if (players[i].discordId === discordId)
            return players[i];
    return false;
};

export function findPlayerByIGN(ign: string) {
    for (let i = 0; i < players.length; i++)
        if (players[i].ign === ign)
            return players[i];
    return false;
}

export function isTarget(player: Player) {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(player))
            return true;
    return false;
}

export function isRegisteredIGN(ign: string) {
    for (let i = 0; i < players.length; i++)
        if (players[i].ign == ign)
            return true;
    return false;
}

/**
 * JSON hit notation:
 * 
 * {
 *      "placer": "name",
 *      "target": "name",
 *      "price": 999,
 *      "datePlaced": "date string"
 * },
 * {
 *      "placer": "name",
 *      "target": "name",
 *      "price": 999,
 *      "datePlaced": "date string"
 * }
 * 
 * JSON player notation:
 * 
 * {
 *      "discordId": 999,
 *      "ign": "name"
 * },
 * {
 *      "discordId": 999,
 *      "ign": "name"
 * }
 */
export function load() {
    fs.readFile(__dirname + '/players.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }

        logger.info('Loaded current player database.');
        players_JSON = JSON.parse(raw);

        for (let i = 0; i < players_JSON.length; i++) {
            const discordId: string = players_JSON[i]["discordId"];
            const ign: string = players_JSON[i]["ign"];
            players.push(new Player(discordId, ign));
        }
    });

    fs.readFile(__dirname + '/hits.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }
        logger.info('Loaded current hit database.')
        hits_JSON = JSON.parse(raw);

        for (let i = 0; i < hits_JSON.length; i++) {
            const placer = findPlayerByIGN(hits_JSON[i]["placer"]);
            const target = findPlayerByIGN(hits_JSON[i]["target"]);
            const price: number = hits_JSON[i]["price"];
            const datePlaced: Date = new Date(hits_JSON[i]["datePlaced"]);
            if (!placer || !target)
                logger.error(`Invalid hit JSON at hit ${i}. Placer or Target not found in registry.`);
            else
                hits.push(new Hit(placer, target, price, datePlaced));
        }
    });
}

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

export function save() {
    syncJSON();

    fs.writeFile(__dirname + '/hits.json', JSON.stringify(hits_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
        logger.info('Saved current hit database.');
    });

    fs.writeFile(__dirname + '/players.json', JSON.stringify(players_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
        logger.info('Saved current player database');
    });
}