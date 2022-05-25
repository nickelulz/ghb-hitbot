import { HIRING_COOLDOWN, TARGETING_COOLDOWN, ADMIN_TOKEN } from "../constants";

export default class Player {
    discordId: string;
    ign: string;
    lastPlacedHit: Date | false;
    lastTargetedHit: Date | false;
    killCount: number;
    deathCount: number;
    isAdmin: boolean;

    constructor(discordId: string, ign: string, lastPlacedHit?: string, lastTargetedHit?: string, killCount?: number, deathCount?: number, isAdmin?: boolean) {
        this.discordId = discordId;
        this.ign = ign;
        this.lastPlacedHit = (lastPlacedHit === undefined || lastPlacedHit == "none") ? false : new Date(lastPlacedHit);
        this.lastTargetedHit = (lastTargetedHit === undefined || lastTargetedHit == "none") ? false : new Date(lastTargetedHit);
        this.killCount = (killCount === undefined) ? 0 : killCount;
        this.deathCount = (deathCount === undefined) ? 0 : deathCount;
        this.isAdmin = (isAdmin === undefined) ? false : isAdmin;

        if (this.discordId === ADMIN_TOKEN)
            this.isAdmin = true;
    }

    get toString() {
        return `${this.ign}@${this.discordId}; KC: ${this.killCount}; DC: ${this.deathCount}`;
    }

    get toJSON() {
        let lph_string: string;
        let lth_string: string;

        lph_string = (!this.lastPlacedHit) ? "none" : this.lastPlacedHit.toISOString();
        lth_string = (!this.lastTargetedHit) ? "none" : this.lastTargetedHit.toISOString();

        return { 
            discordId: this.discordId, 
            ign: this.ign, 
            lastPlacedHit: lph_string, 
            lastTargetedHit: lth_string,
            killCount: this.killCount,
            deathCount: this.deathCount,
            isAdmin: this.isAdmin
        };
    }

    get hiringCooldown() {
        if (!this.lastPlacedHit)
            return 0;
        else {
            // 2 hour cooldown
            // Returns time in minutes
            let cooldown: number = HIRING_COOLDOWN - ((Number(new Date().getTime) - Number(this.lastPlacedHit.getTime)) * 1000 * 60);
            if (cooldown == 0)
                this.lastPlacedHit = false;
            return cooldown;
        }   
    }

    get hiringCooldownString() {
        const hiringCooldown: number = this.hiringCooldown;
        return `${hiringCooldown / 60}h ${hiringCooldown % 60}m`;
    }

    get targetingCooldown() {
        if (!this.lastTargetedHit)
            return 0;
        else {
            // 1 hour cooldown
            // Returns time in minutes
            let cooldown: number = TARGETING_COOLDOWN - ((Number(new Date().getTime) - Number(this.lastTargetedHit.getTime)) * 1000 * 60);
            if (cooldown == 0)
                this.lastTargetedHit = false;
            return cooldown;
        }
    }

    get targetingCooldownString() {
        const targetingCooldown: number = this.targetingCooldown;
        return `${targetingCooldown / 60}h ${targetingCooldown % 60}m`;
    }

    equals(other: Player) {
        return this.discordId === other.discordId && this.ign === other.ign;
    }
}