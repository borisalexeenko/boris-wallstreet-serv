import {v4 as uuid} from "uuid";

export class Stock {
    constructor(name, amount, distributionLaw, maxToChange, startPrice) {
        this.id = uuid();
        this.name = name;
        this.amount = amount;
        this.distributionLaw = distributionLaw;
        this.maxToChange = maxToChange;
        this.startPrice = startPrice;
    }
}
