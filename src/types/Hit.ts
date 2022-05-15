import Player from './Player'

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

    get toString() {
        return `${this.target.ign}'s head for ${this.price} diamonds. Placed at ${this.place_time.toDateString}`;
    }

    equals(other: Hit) {
        return this.placer.equals(other.placer) && this.target.equals(other.target) && this.price == other.price;
    }
}