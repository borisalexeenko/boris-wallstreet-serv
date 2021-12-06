import { Broker } from "./broker.js";
import * as fs from 'fs';
import {Stock} from "./stock.js";

const DB_FILE = '/home/toa/WebstormProjetcs/wallstreet-serv-sockets/db.json';

export class StockExchange {
    
    constructor(){
        let initData = {};
        try {
            initData = JSON.parse(fs.readFileSync(DB_FILE));
            this.brokers = initData['brokers'];
            this.stocks = initData['stocks'];
            this.params = initData['params']
            console.log(this.brokers);
            console.log(this.stocks);
            console.log(this.params);
        }
        catch (err) {
            console.log(`Error while reading file: ${err}`);
        }
    }

    addBroker(name, resources, imageURL) {
        let broker = new Broker(name, resources, imageURL);
        this.brokers[broker.id] = broker;
        this.save()
    }

    getBroker(id) {
        return this.brokers[id];
    }

    removeBroker(id) {
        if(id in this.brokers){
            delete this.brokers[id];
            this.save();
        }
    }

    editBroker(dto) {
        let broker = this.getBroker(dto.id);
        if(broker !== undefined) {
          this.brokers[dto.id] = dto;
          this.save();
        }
        return dto;
    }

    editStock(dto) {
        let stock = this.getStock(dto.id);
        if(stock !== undefined) {
            this.stocks[dto.id] = dto;
            this.save();
        }
        return dto;
    }

    getStock(id) {
        return this.stocks[id];
    }

    addStock(name, amount, distributionLaw, maxToChange, startPrice) {
        let stock = new Stock(name, distributionLaw, amount, maxToChange, startPrice);
        console.log(startPrice);
        this.stocks[stock.id] = stock;
        this.save();
    }

    removeStock(id) {
        if(id in this.stocks){
            delete this.stocks[id];
            this.save();
        }
    }

    save() {
        fs.writeFile(DB_FILE, JSON.stringify(this), err => {
            if(err) throw err;
            console.log('DB saved');
        })
    }
}
