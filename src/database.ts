import fs from 'fs'
import logger from './logger'
import Bounty from './types/Bounty'
import Contract from './types/Contract';
import Player from './types/Player'

let hits_JSON: any[];
export let hits: Bounty[] = [];

let players_JSON: any[];
export let players: Player[] = [];

export function findPlayerById(discordId: string): Player | false {
    for (let i = 0; i < players.length; i++)
        if (players[i].discordId === discordId)
            return players[i];
    return false;
};

export function findPlayerByIGN(ign: string): Player | false {
    for (let i = 0; i < players.length; i++)
        if (players[i].ign === ign)
            return players[i];
    return false;
}

export function isTarget(player: Player): boolean {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(player))
            return true;
    return false;
}

export function isContractor(player: Player): boolean {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(player))
            return true;
    return false;
}

export function removeAllHits(player: Player): void {
    for (let i = 0; i < hits.length; i++)
        if (hits[i].target.equals(player) || hits[i].placer.equals(player))
            hits.splice(i, 1);
}

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
            const lastPlacedHit: string = players_JSON[i]["lastPlacedHit"];
            const lastTargetedHit: string = players_JSON[i]["lastTargetedHit"];
            const killCount: number = players_JSON[i]["killCount"];
            const deathCount: number = players_JSON[i]["deathCount"];
            const isAdmin: boolean = players_JSON[i]["isAdmin"];
            players.push(new Player(discordId, ign, lastPlacedHit, lastTargetedHit, killCount, deathCount, isAdmin));
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
            const type: string = hits_JSON[i]["type"];
            if (!placer || !target)
                logger.error(`Invalid hit JSON at hit ${i}. Placer or Target not found in registry.`);
            else {
                switch (type) {
                    case "bounty":
                        hits.push(new Bounty(placer, target, price, datePlaced));
                        break;
                    case "contract":
                        const contractor = findPlayerByIGN(hits_JSON[i]["contractor"]);
                        const publicity = hits_JSON[i]["publicity"];
                        if (!contractor)
                            logger.error(`Invalid contracted hit JSON at hit ${i}. Contractor not found in registry.`);
                        else
                            hits.push(new Contract(placer, target, price, datePlaced, contractor, publicity));
                        break;
                }
            }
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
    });

    fs.writeFile(__dirname + '/players.json', JSON.stringify(players_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });
}