import Bounty from './Bounty';
import Player from './Player';

/**
 * @class Contract
 * @extends Hit
 */
export default class Contract extends Bounty {
    contractor: Player;
    publicity: boolean;

    constructor(placer: Player, target: Player, price: number, place_time: Date, contractor: Player, publicity: boolean) {
        super(placer, target, price, place_time);
        this.contractor = contractor;
        this.publicity = publicity;
    }

    /**
     * @override
     */
    get toString(): string {
        return super.toString + " Contracted with: " + this.contractor.ign + " " + (this.publicity) ? "Public." : "Private";
    }

    /**
     * @override
     */
    get toJSON() {
        const place_time_string: string = this.place_time.toISOString();
        return { 
            type: "contract",
            placer: this.placer.ign, 
            target: this.target.ign, 
            price: this.price, 
            datePlaced: place_time_string,
            contractor: this.contractor.ign,
            publicity: this.publicity
        };
    }

    /**
     * @override
     */
    equals(other: Bounty): boolean {
        if (!(other instanceof Contract))
            return false;
        return super.equals(other) && this.contractor.equals(other.contractor);
    }
}