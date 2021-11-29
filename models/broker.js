import { v4 as uuid } from 'uuid';


export class Broker {
    constructor(name, resources, imageURL) {
        this.id = uuid();
        this.name = name;
        this.resources = resources;
        this.imageURL = imageURL;
    }
}