import logger from "../logger";
import { client } from "../main";
import { HIRING_COOLDOWN, TARGETING_COOLDOWN } from "../constants";

export default class Player {
    discordId: string;
    ign: string;

    lastPlacedHit: Date | false;
    lastTargetedHit: Date | false;

    constructor(discordId: string, ign: string) {
        this.discordId = discordId;
        this.ign = ign;

        this.lastPlacedHit = false;
        this.lastTargetedHit = false;
    }

    get toString() {
            return `${this.ign}@${this.discordId}`;
    }

    get toJSON() {
        return { discordId: this.discordId, ign: this.ign };
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