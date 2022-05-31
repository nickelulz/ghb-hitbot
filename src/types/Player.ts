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

    /**
     * The constructor of a Player object.
     * @param {string} discordId The discord ID of this user
     * @param {string} ign The IGN of this user
     * @param {string} lastPlacedHit (Optional) A string representation of the last placed hit of this user. (Or 'none' if there is none/expired.)
     * @param {string} lastTargetedHit (Optional) A string representation of the last targetted hit of this user. (Or 'none' if there is none/expired.)
     * @param {string} lastContractedHit (Optional) A string representation of the last contracted hit of this user. (Or 'none' if there is none/expired.)
     * @param {number} killCount (Optional) The number of kills this user has.
     * @param {number} deathCount (Optional) The number of deaths this user has.
     * @param {boolean} isAdmin (Optional) If this user is an admin.
     */
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

    /**
     * Returns a string representation of this object.
     * @returns string
     */
    get toString(): string {
        return `${this.ign}@${this.discordId}; KC: ${this.killCount}; DC: ${this.deathCount}`;
    }

    /**
     * Returns a JSON representation of this object.
     * @returns JSON
     */
    get toJSON(): any {
        const lph_string = (!this.lastPlacedHit) ? "none" : this.lastPlacedHit.toLocaleString();
        const lth_string = (!this.lastTargetedHit) ? "none" : this.lastTargetedHit.toLocaleString();
        const lch_string = (!this.lastContractedHit) ? "none" : this.lastContractedHit.toLocaleString();

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

    /**
     * 
     * @param {Date} date 
     * @returns {number} Amount of time since the date in minutes.
     */
    private timeSinceDate(date: Date): number {
        return Math.ceil(Math.abs(Date.now() - date.getTime()) / (1000 * 60)); 
    }

    /**
     * Returns the total number of minutes left on the
     * remaining hiring cooldown of a player.
     * @returns number
     */
    get hiringCooldown(): number {
        if (!this.lastPlacedHit)
            return 0;
        else {
            // 2 hour cooldown
            // Returns time in minutes
            let cooldown: number = HIRING_COOLDOWN - this.timeSinceDate(this.lastPlacedHit);
            if (cooldown == 0)
                this.lastPlacedHit = false;
            return cooldown;
        }   
    }

    /**
     * Returns a string representation of the remaining 
     * hiring cooldown of a player. (in hours and minutes)
     * @returns string
     */
    get hiringCooldownString(): string {
        const hiringCooldown: number = this.hiringCooldown;
        return `${hiringCooldown / 60}h ${hiringCooldown % 60}m`;
    }

    /**
     * Returns the total number of minutes left on the
     * remaining targetting cooldown of a player.
     * @returns number
     */
    get targetingCooldown(): number {
        if (!this.lastTargetedHit)
            return 0;
        else {
            // Returns time in minutes
            let cooldown: number = TARGETING_COOLDOWN - this.timeSinceDate(this.lastTargetedHit);
            if (cooldown == 0)
                this.lastTargetedHit = false;
            return cooldown;
        }
    }

    /**
     * Returns a string representation of the remaining 
     * targetting cooldown of a player. (in hours and minutes)
     * @returns string
     */
    get targetingCooldownString(): string {
        const targetingCooldown: number = this.targetingCooldown;
        return `${targetingCooldown / 60}h ${targetingCooldown % 60}m`;
    }

    /**
     * Returns the total number of minutes left on the
     * remaining contracting cooldown of a player.
     * @returns number
     */
    get contractingCooldown(): number {
        if (!this.lastContractedHit)
            return 0;
        else {
            // returns time in mins
            let cooldown: number = CONTRACTING_COOLDOWN - this.timeSinceDate(this.lastContractedHit);
            if (cooldown == 0)
                this.lastContractedHit = false;
            return cooldown;
        }
    }

    /**
     * Returns a string representation of the remaining 
     * contracting cooldown of a player. (in hours and minutes)
     * @returns string
     */
    get contractingCooldownString(): string {
        const contractingCooldown: number = this.contractingCooldown;
        return `${contractingCooldown / 60}h ${contractingCooldown % 60}m`;
    }

    /**
     * Evaluates whether this object and another object are equal (the same).
     * @param {Player} other The other player to compare to.
     * @returns boolean
     */
    equals(other: Player): boolean {
        return this.discordId === other.discordId && this.ign === other.ign;
    }
}