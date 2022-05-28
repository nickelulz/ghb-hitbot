import Player from './Player';
import Hit from './Hit'
import logger from 'src/logger';

/**
 * @class Contract
 * @extends Hit
 */
export default class Contract extends Hit {
    contractor: Player;
    publicity: boolean;
    pending: boolean;

    constructor(placer: Player, target: Player, price: number, place_time: Date, contractor: Player, publicity: boolean, pending: boolean) {
        super(placer, target, price, place_time);
        this.contractor = contractor;
        this.publicity = publicity;
        this.pending = pending;
    }

    /**
     * @override
     */
    get toString() {
        return `${this.target.ign} - ${this.price} diamonds. Contractor: ${this.contractor.ign}. ` + ((this.publicity) ? "PUBLIC." : "PRIVATE.");
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
            publicity: this.publicity,
            pending: this.pending
        };
    }

    /**
     * @override
     */
    equals(other: Hit): boolean {
        if (!(other instanceof Contract))
            return false;
        return super.equals(other) && this.contractor.equals(other.contractor);
    }
}