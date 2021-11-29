import {v4 as uuid} from "uuid";

export class Stock {
    constructor(name, distributionLaw, maxToChange, startPrice) {
        this.id = uuid();
        this.name = name;
        this.distributionLaw = distributionLaw;
        this.maxToChange = maxToChange;
        this.startPrice = startPrice;
    }
}
