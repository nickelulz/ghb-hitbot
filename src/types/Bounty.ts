import Contract from './Contract';
import Hit from './Hit';
import Player from './Player'


/**
 * @class Bounty
 */
export default class Bounty extends Hit {

    constructor(placer: Player, target: Player, price: number, place_time: Date) {
        super(placer, target, price, place_time);
    }

    /**
     * @override
     */
    get toString(): string {
        return `${this.target.ign} - ${this.price} diamonds. Placed by ${this.placer.ign}`;
    }

    /**
     * @override
     */
    get toJSON() {
        const place_time_string: string = super.place_time.toISOString();
        return { 
            type: "bounty",
            placer: super.placer.ign, 
            target: super.target.ign, 
            price: super.price, 
            datePlaced: place_time_string
        };
    }

    /**
     * @override
     * @param Hit
     * @returns boolean
     */
    equals(other: Hit): boolean {
        if (!(other instanceof Bounty) || other instanceof Contract)
            return false;
        return super.equals(other);
    }
}