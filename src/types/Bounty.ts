import Contract from './Contract';
import Hit from './Hit';
import Player from './Player';


/**
 * A public alternative to Contracts such that anybody can claim them.
 * @class Bounty
 * @extends Hit
 */
export default class Bounty extends Hit {

    constructor(placer: Player, target: Player, price: number, place_time: Date, claim_time?: Date) {
        super(placer, target, price, place_time, claim_time);
    }

    /**
     * @returns A string representation of the Bounty.
     * @override
     */
    get toString(): string {
        return `${this.target.ign} - ${this.price} diamonds. Placed by ${this.placer.ign}`;
    }

    /**
     * @returns A JSON object containing all of the Bounty's data.
     * @override
     */
    get toJSON(): any {
        const place_time_string: string = super.place_time.toISOString();
        const claim_time_string: string = (this.claim_time === undefined) ? "none" : this.claim_time.toISOString();

        return { 
            type: "bounty",
            placer: super.placer.ign, 
            target: super.target.ign, 
            price: super.price, 
            datePlaced: place_time_string,
            dateClaimed: claim_time_string
        };
    }

    /**
     * @param {Hit} other The other Hit object to be evaluated.
     * @returns {boolean} Whether the two objects are equal.
     * @override
     */
    equals(other: Hit): boolean {
        if (!(other instanceof Bounty) || other instanceof Contract)
            return false;
        return super.equals(other);
    }
}