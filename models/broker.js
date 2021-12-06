import { v4 as uuid } from 'uuid';


export class Broker {
    constructor(name, resources, imageURL) {
        this.id = uuid();
        this.name = name;
        this.resources = resources;
        this.imageURL = imageURL;
        this.amount = 0;
    }

    setBoughtStocks(boughtStocks) {
        this['boughtStocks'] = boughtStocks;
    }

    plusAmount(plus){
        this['amount'] += plus;
    }
}
