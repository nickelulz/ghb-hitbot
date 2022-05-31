import Player from './Player'


/**
 * @class Hit
 * @abstract
 */
export default class Hit {
    /**
     * The player that placed the hit.
     * @type Player
     */
    placer: Player;

    /**
     * The target of the hit.
     * @type Player
     */
    target: Player;

    /**
     * The price of the hit. Must be greater than MINIMUM_HIT_PRICE (constants.ts) diamonds.
     * @type number
     */
    price: number;

    /**
     * The time that the hit was placed.
     * @type Date
     */
    place_time: Date;

    /**
     * The time that this hit was claimed
     * @type Date | undefined
     */
    claim_time: Date | undefined;

    /**
     * The person who claimed this hit
     * @type Player | undefined
     */
    claimer: Player | undefined

    constructor(placer: Player, target: Player, price: number, place_time: Date, claim_time?: Date, claimer?: Player) {
        this.placer = placer;
        this.target = target;
        this.price = price;
        this.place_time = place_time;
        this.claim_time = claim_time;
        this.claimer = claimer;
    }

    /**
     * @returns A string representation of the Hit.
     * @abstract Must be implemented.
     */
    get toString(): string {
        throw new Error("toString in class Hit must be implemented");
    }

    /**
     * @returns A JSON object containing all of the Hit's data.
     * @abstract Must be implemented.
     */
    get toJSON(): any {
        throw new Error("toJSON in class Hit must be implemented");
    }

    /**
     * @param {Hit} other The other Hit object to be evaluated.
     * @returns {boolean} Whether the two objects are equal.
     */
    equals(other: Hit): boolean {
        return this.placer.equals(other.placer) && this.target.equals(other.target) && this.price == other.price && this.place_time.getTime() === other.place_time.getTime();
    }
}