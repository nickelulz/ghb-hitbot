import Player from './Player'

export default class Hit {
    placer: Player;
    target: Player;
    price: number;

    constructor(placer: Player, target: Player, price: number) {
        this.placer = placer;
        this.target = target;
        this.price = price;
    }

    get toString() {
        return `${this.target.ign}'s head for ${this.price} diamonds.`;
    }
}