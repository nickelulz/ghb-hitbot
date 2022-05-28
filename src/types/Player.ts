import { HIRING_COOLDOWN, TARGETING_COOLDOWN, CONTRACTING_COOLDOWN, ADMIN_TOKEN } from "../constants";

export default class Player {
    discordId: string;
    ign: string;
    lastPlacedHit: Date | false;
    lastTargetedHit: Date | false;
    lastContractedHit: Date | false;
    killCount: number;
    deathCount: number;
    isAdmin: boolean;

    constructor(discordId: string, ign: string, lastPlacedHit?: string, lastTargetedHit?: string, lastContractedHit?: string, killCount?: number, deathCount?: number, isAdmin?: boolean) {
        this.discordId = discordId;
        this.ign = ign;
        this.lastPlacedHit = (lastPlacedHit === undefined || lastPlacedHit == "none") ? false : new Date(lastPlacedHit);
        this.lastTargetedHit = (lastTargetedHit === undefined || lastTargetedHit == "none") ? false : new Date(lastTargetedHit);
        this.lastContractedHit = (lastContractedHit === undefined || lastContractedHit == "none") ? false : new Date(lastContractedHit);
        this.killCount = (killCount === undefined) ? 0 : killCount;
        this.deathCount = (deathCount === undefined) ? 0 : deathCount;
        this.isAdmin = (isAdmin === undefined) ? false : isAdmin;

        if (this.discordId === ADMIN_TOKEN)
            this.isAdmin = true;
    }

    get toString(): string {
        return `${this.ign}@${this.discordId}; KC: ${this.killCount}; DC: ${this.deathCount}`;
    }

    get toJSON(): any {
        const lph_string = (!this.lastPlacedHit) ? "none" : this.lastPlacedHit.toISOString();
        const lth_string = (!this.lastTargetedHit) ? "none" : this.lastTargetedHit.toISOString();
        const lch_string = (!this.lastContractedHit) ? "none" : this.lastContractedHit.toISOString();

        return { 
            discordId: this.discordId, 
            ign: this.ign, 
            lastPlacedHit: lph_string, 
            lastTargetedHit: lth_string,
            lastContractedHit: lch_string,
            killCount: this.killCount,
            deathCount: this.deathCount,
            isAdmin: this.isAdmin
        };
    }

    get hiringCooldown(): number {
        if (!this.lastPlacedHit)
            return 0;
        else {
            // 2 hour cooldown
            // Returns time in minutes
            let cooldown: number = HIRING_COOLDOWN - ((Date.now() - Number(this.lastPlacedHit.getTime)) * 1000 * 60);
            if (cooldown == 0)
                this.lastPlacedHit = false;
            return cooldown;
        }   
    }

    get hiringCooldownString(): string {
        const hiringCooldown: number = this.hiringCooldown;
        return `${hiringCooldown / 60}h ${hiringCooldown % 60}m`;
    }

    get targetingCooldown(): number {
        if (!this.lastTargetedHit)
            return 0;
        else {
            // Returns time in minutes
            let cooldown: number = TARGETING_COOLDOWN - ((Date.now() - Number(this.lastTargetedHit.getTime)) * 1000 * 60);
            if (cooldown == 0)
                this.lastTargetedHit = false;
            return cooldown;
        }
    }

    get targetingCooldownString(): string {
        const targetingCooldown: number = this.targetingCooldown;
        return `${targetingCooldown / 60}h ${targetingCooldown % 60}m`;
    }

    get contractingCooldown(): number {
        if (!this.lastContractedHit)
            return 0;
        else {
            // returns time in mins
            let cooldown: number = CONTRACTING_COOLDOWN - ((Date.now() - Number(this.lastContractedHit.getTime)) * 1000 * 60);
            if (cooldown == 0)
                this.lastContractedHit = false;
            return cooldown;
        }
    }

    get contractingCooldownString(): string {
        const contractingCooldown: number = this.contractingCooldown;
        return `${contractingCooldown / 60}h ${contractingCooldown % 60}m`;
    }

    equals(other: Player): boolean {
        return this.discordId === other.discordId && this.ign === other.ign;
    }
}