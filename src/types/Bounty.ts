import Contract from './Contract';
import Player from './Player'


/**
 * @class Bounty
 */
export default class Bounty {
    placer: Player;
    target: Player;
    price: number;
    place_time: Date;

    constructor(placer: Player, target: Player, price: number, place_time: Date) {
        this.placer = placer;
        this.target = target;
        this.price = price;
        this.place_time = place_time;
    }

    get toString(): string {
        return `${this.target.ign}'s head for ${this.price} diamonds. Placed at ${this.place_time.toDateString()}`;
    }

    get toJSON() {
        const place_time_string: string = this.place_time.toISOString();
        return { 
            type: "bounty",
            placer: this.placer.ign, 
            target: this.target.ign, 
            price: this.price, 
            datePlaced: place_time_string
        };
    }

    equals(other: Bounty): boolean {
        if (!(other instanceof Bounty) || other instanceof Contract)
            return false;
        return this.placer.equals(other.placer) && this.target.equals(other.target) && this.price == other.price;
    }
}