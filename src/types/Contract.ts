import Player from './Player';
import Hit from './Hit';

/**
 * @class Contract
 * @extends Hit
 */
export default class Contract extends Hit {
    /**
     * The designated contractor/assassin for the contract.
     * @type Player
     */
    contractor: Player;

    /**
     * Whether this contract is public (the placer and contractor 
     * can be viewed) or private (only the contractor can be viewed).
     * @type boolean
     */
    publicity: boolean;

    /**
     * Whether this contract is still in pending (Not yet accepted 
     * by the contractor).
     * @type boolean
     */
    pending: boolean;

    constructor(placer: Player, target: Player, price: number, place_time: Date, contractor: Player, publicity: boolean, pending: boolean) {
        super(placer, target, price, place_time);
        this.contractor = contractor;
        this.publicity = publicity;
        this.pending = pending;
    }

    /**
     * @returns A string representation of the Contract.
     * @override
     */
    get toString(): string {
        return `${this.target.ign} - ${this.price} diamonds. Contractor: ${this.contractor.ign}. ` + ((this.publicity) ? "PUBLIC." : "PRIVATE.");
    }

    /**
     * @returns A JSON object containing all of the Contract's data.
     * @override
     */
    get toJSON(): any {
        const place_time_string: string = this.place_time.toISOString();
        return { 
            type: "contract",
            placer: this.placer.ign, 
            target: this.target.ign, 
            price: this.price, 
            datePlaced: place_time_string,
            contractor: this.contractor.ign,
            publicity: this.publicity,
            pending: this.pending
        };
    }

    /**
     * @param {Hit} other The other Hit object to be evaluated.
     * @returns {boolean} Whether the two objects are equal.
     * @override
     */
    equals(other: Hit): boolean {
        if (!(other instanceof Contract))
            return false;
        return super.equals(other) && this.contractor.equals(other.contractor);
    }
}