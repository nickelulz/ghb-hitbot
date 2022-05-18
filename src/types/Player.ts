import logger from "../logger";
import { client } from "../main";
import { HIRING_COOLDOWN, TARGETING_COOLDOWN } from "../constants";

export default class Player {
    discordId: string;
    ign: string;
    lastPlacedHit: Date | false;
    lastTargetedHit: Date | false;
    killCount: number;
    deathCount: number;

    constructor(discordId: string, ign: string, lastPlacedHit?: string, lastTargetedHit?: string, killCount?: number, deathCount?: number) {
        this.discordId = discordId;
        this.ign = ign;
        this.lastPlacedHit = (lastPlacedHit === undefined || lastPlacedHit == "expired") ? false : new Date(lastPlacedHit);
        this.lastTargetedHit = (lastTargetedHit === undefined || lastTargetedHit == "expired") ? false : new Date(lastTargetedHit);
        this.killCount = (killCount === undefined) ? 0 : killCount;
        this.deathCount = (deathCount === undefined) ? 0 : deathCount;
    }

    get toString() {
        return `${this.ign}@${this.discordId}; KC: ${this.killCount}; DC: ${this.deathCount}`;
    }

    get toJSON() {
        let lph_string: string;
        let lth_string: string;

        lph_string = (!this.lastPlacedHit) ? "expired" : this.lastPlacedHit.toISOString();
        lth_string = (!this.lastTargetedHit) ? "expired" : this.lastTargetedHit.toISOString();

        return { 
            discordId: this.discordId, 
            ign: this.ign, 
            lastPlacedHit: lph_string, 
            lastTargetedHit: lth_string,
            killCount: this.killCount,
            deathCount: this.deathCount
        };
    }

    get hiringCooldown() {
        if (!this.lastPlacedHit)
            return 0;
        else
            // 2 hour cooldown
            // Returns time in minutes
            return HIRING_COOLDOWN - ((Number(new Date().getTime) - Number(this.lastPlacedHit.getTime)) * 1000 * 60);
    }

    get hiringCooldownString() {
        const hiringCooldown: number = this.hiringCooldown;
        return `${hiringCooldown / 60}h ${hiringCooldown % 60}m`;
    }

    get targetingCooldown() {
        if (!this.lastTargetedHit)
            return 0;
        else
            // 1 hour cooldown
            // Returns time in minutes
            return TARGETING_COOLDOWN - ((Number(new Date().getTime) - Number(this.lastTargetedHit.getTime)) * 1000 * 60);
    }

    get targetingCooldownString() {
        const targetingCooldown: number = this.targetingCooldown;
        return `${targetingCooldown / 60}h ${targetingCooldown % 60}m`;
    }

    equals(other: Player) {
        return this.discordId === other.discordId && this.ign === other.ign;
    }
}