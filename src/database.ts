import fs from 'fs'
import logger from './logger'
import Bounty from './types/Bounty'
import Contract from './types/Contract';
import Player from './types/Player'

let hits_JSON: any[];
export let hits: Bounty[] = [];

let pending_hits_JSON: any[];
export let pending_hits: Bounty[] = [];

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

export function findContract(placer: Player, contractor: Player): Contract | false {
    for (let i = 0; i < hits.length; i++)
        if (hits[i] instanceof Contract && (<Contract> hits[i]).contractor.equals(contractor) && (<Contract> hits[i]).placer.equals(placer))
            return (<Contract> hits[i]);
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
    fs.readFile(__dirname + './databases/players.json', 'utf-8', (err, raw: string) => {
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

    fs.readFile(__dirname + './databases/hits.json', 'utf-8', (err, raw: string) => {
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

    fs.readFile(__dirname + './databases/pending_hits.json', 'utf-8', (err, raw: string) => {
        if (err) {
            logger.error(err);
            return;
        }
        logger.info('Loaded current hit database.')
        hits_JSON = JSON.parse(raw);

        for (let i = 0; i < hits_JSON.length; i++) {
            const placer = findPlayerByIGN(pending_hits_JSON[i]["placer"]);
            const target = findPlayerByIGN(pending_hits_JSON[i]["target"]);
            const price: number = pending_hits_JSON[i]["price"];
            const datePlaced: Date = new Date(pending_hits_JSON[i]["datePlaced"]);
            const contractor = findPlayerByIGN(hits_JSON[i]["contractor"]);
            const publicity = hits_JSON[i]["publicity"];

            if (!placer || !target || !contractor)
                logger.error(`Invalid hit JSON at pending hit ${i}. Placer, Target, or Contractor not found in registry.`);
            else
                hits.push(new Contract(placer, target, price, datePlaced, contractor, publicity));
        }
    });
}

function syncJSON() {
    // Clear Arrays
    pending_hits_JSON.length = 0;
    hits_JSON.length = 0;
    players_JSON.length = 0;

    // Copy from player arrays to player JSON arrays 
    for (let i = 0; i < players.length; i++)
        players_JSON.push(players[i].toJSON);
    // Copy from hit array to hit JSON array
    for (let i = 0; i < hits.length; i++)
        hits_JSON.push(hits[i].toJSON);
    // Copy from pending hit array to pending JSON array
    for (let i = 0; i < pending_hits.length; i++)
        pending_hits_JSON.push(pending_hits[i].toJSON);
}

export function save() {
    syncJSON();

    fs.writeFile(__dirname + './databases/hits.json', JSON.stringify(hits_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });

    fs.writeFile(__dirname + './databases/players.json', JSON.stringify(players_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });

    fs.writeFile(__dirname + './databases/pending_hits.json', JSON.stringify(pending_hits_JSON, null, 2), (err) => {
        if (err) {
            logger.error(err);
            return;
        }
    });
}