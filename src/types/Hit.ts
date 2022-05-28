import Player from './Player'


/**
 * @class Hit
 * @abstract
 */
export default class Hit {
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
        throw new Error("toString in class Hit must be implemented");
    }

    get toJSON(): any {
        throw new Error("toJSON in class Hit must be implemented");
    }

    equals(other: Hit): boolean {
        return this.placer.equals(other.placer) && this.target.equals(other.target) && this.price == other.price && this.place_time.getTime() === other.place_time.getTime();
    }
}