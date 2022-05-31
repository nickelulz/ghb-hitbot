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
     * Whether this contract is still in pending (Not yet accepted 
     * by the contractor).
     * @type boolean
     */
    pending: boolean;

    constructor(placer: Player, target: Player, price: number, place_time: Date, contractor: Player, pending: boolean, claim_time?: Date, claimer?: Player) {
        super(placer, target, price, place_time, claim_time)
        this.contractor = contractor;
        this.pending = pending;
        this.claimer = claimer;
    }

    /**
     * @returns A string representation of the Contract.
     * @override
     */
    get toString(): string {
        return `${this.target.ign} - ${this.price} diamonds. Contractor: ${this.contractor.ign}. `;
    }

    /**
     * @returns A JSON object containing all of the Contract's data.
     * @override
     */
    get toJSON(): any {
        const place_time_string: string = this.place_time.toLocaleString();
        const claim_time_string: string = (this.claim_time === undefined) ? "none" : this.claim_time.toLocaleString();
        const claimer_string: string = (this.claimer === undefined) ? "none" : this.claimer.ign;

        return { 
            type: "contract",
            placer: this.placer.ign, 
            target: this.target.ign, 
            price: this.price, 
            datePlaced: place_time_string,
            contractor: this.contractor.ign,
            pending: this.pending,
            dateClaimed: claim_time_string,
            claimer: claimer_string
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