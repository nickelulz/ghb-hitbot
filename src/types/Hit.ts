import Player from './Player'

export default class Hit {
    placer: Player;
    target: Player;
    price: number;
    place_time: Date;
    place_time_string: string;

    constructor(placer: Player, target: Player, price: number, place_time: Date) {
        this.placer = placer;
        this.target = target;
        this.price = price;
        this.place_time = place_time;
        this.place_time_string = place_time.toDateString();
    }

    get toString() {
        return `${this.target.ign}'s head for ${this.price} diamonds. Placed at ${this.place_time.toDateString()}`;
    }

    get toJSON() {
        return { placer: this.placer.ign, target: this.target.ign, price: this.price, datePlaced: this.place_time_string };
    }

    toStringOptionalPlacer(placer: Player) {
        if (placer.equals(this.placer))
            return this.toString + " *PLACED BY YOU*";
        return this.toString;
    }

    equals(other: Hit) {
        return this.placer.equals(other.placer) && this.target.equals(other.target) && this.price == other.price;
    }
}