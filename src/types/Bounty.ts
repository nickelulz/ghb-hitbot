import Contract from './Contract';
import Hit from './Hit';
import Player from './Player';


/**
 * A public alternative to Contracts such that anybody can claim them.
 * @class Bounty
 * @extends Hit
 */
export default class Bounty extends Hit {

    constructor(placer: Player, target: Player, price: number, place_time: Date, claim_time?: Date, claimer?: Player) {
        super(placer, target, price, place_time, claim_time, claimer);
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
        const place_time_string: string = this.place_time.toLocaleString();
        const claim_time_string: string = (this.claim_time === undefined) ? "none" : this.claim_time.toLocaleString();
        const claimer_string: string = (this.claimer === undefined) ? "none" : this.claimer.ign;

        return { 
            type: "bounty",
            placer: this.placer.ign, 
            target: this.target.ign, 
            price: this.price, 
            datePlaced: place_time_string,
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
        if (!(other instanceof Bounty) || other instanceof Contract)
            return false;
        return super.equals(other);
    }
}