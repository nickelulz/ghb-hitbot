import fs from 'fs'
import logger from './logger'
import Hit from './types/Hit'
import Player from './types/Player'

let hits_JSON: [];
let hits: Hit[] = [];

let players_JSON: [];
let players: Player[] = [];

async function findPlayer(discordId: number) {
    players.forEach((player: Player, index: number) => {
        if (player.discordId == discordId)
            return player;
    });
    throw new Error("Player not found!");
};

/**
 * JSON hit notation:
 * 
 * {
 *      "placer": "name",
 *      "target": "name",
 *      "price": 999,
 * },
 * {
 *      "placer": "name",
 *      "target": "name",
 *      "price": 999
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
function load() {
    fs.readFile(__dirname + '/hits.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }
        logger.info('Loaded current hit database.')
        hits_JSON = JSON.parse(raw);

        // logger.debug("Printing the current database JSON");
        // for (let x in hits_JSON) {
        //     console.log(x + ": " + JSON.stringify(hits_JSON[x]));
        //     const data = hits_JSON[x];
        //     //hitlist.push(new Hit(data.placer, data.target, data.price));
        // }
        // console.log(hits_JSON[0]["placer"]);
    });

    fs.readFile(__dirname + '/players.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }

        logger.info('Loaded current player database.');
        players_JSON = JSON.parse(raw);
    });
}

function save() {
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

export { load, save, hits, players, findPlayer };