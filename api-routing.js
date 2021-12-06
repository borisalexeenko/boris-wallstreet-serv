import express from 'express';
import {StockExchange} from './models/stock-exchange.js'
import cors from 'cors';
import http, {get} from 'http';
import {Server} from "socket.io";
import {Broker} from "./models/broker.js";

let stockExchange = new StockExchange();
export const router = express.Router();

const server = http.createServer();
const io = new Server(server, {cors: {origin: '*'}});


let lastConnected = undefined;
io.on('connection', socket => {
    let currentBroker;
    let boughtStocks = {};
    console.log(lastConnected);
    socket.emit('connection', null);
    socket.on('disconnect', s => {
        currentBroker = stockExchange.getBroker(lastConnected);
        console.log(`Client ${socket.id} disconnected`)
    })
    socket.on('broker', msg => {
        console.log(msg);
        lastConnected = msg.message.id
        currentBroker = stockExchange.getBroker(lastConnected);
    })

    socket.on('buy', msg => {
        currentBroker = stockExchange.getBroker(lastConnected);
        console.log(currentBroker);
        let amount = msg.message.amount
        let stock = stockExchange.getStock(msg.message.id);

        if (!(stock.id in currentBroker.boughtStocks) || Object.keys(currentBroker.boughtStocks).length === 0) {
            currentBroker.resources -= stock.startPrice * amount;
            currentBroker.amount = Number(currentBroker.amount) + Number(amount);

            currentBroker['boughtStocks'][stock.id] = amount;

            stock.amount -= amount;
            stockExchange.save();
        }

        socket.on('sold', msg => {
            currentBroker = stockExchange.getBroker(lastConnected);

            let stock_id = msg.message.stock_id;
            let amount = msg.message.amount;
            console.log(stock_id, amount)
            if (Number(currentBroker.boughtStocks[stock_id]) - Number(amount) >= 0) {
                currentBroker.amount = Number(currentBroker.amount) - Number(amount);
                currentBroker.boughtStocks[stock_id] -= Number(currentBroker.boughtStocks[stock_id]) - Number(amount);
                if (currentBroker.boughtStocks[stock_id] === 0) {
                    delete currentBroker.boughtStocks[stock_id];
                }
            }
            stockExchange.save()
        })

    })
});

server.listen(8000)

let corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200
}

router.get('/', cors(corsOptions), (req, res, next) => {
    res.json({'greetings': 'Hello!'});
    next();
})

router.get('/get_broker/:id', cors(corsOptions), (req, res, next) => {
    res.json(stockExchange.getBroker(req.params.id));
    next();
})


router.get('/get_brokers', cors(corsOptions), (req, res, next) => {
    res.json(stockExchange.brokers);
    next();
});

router.get('/get_stocks', cors(corsOptions), (req, res, next) => {
    res.json(stockExchange.stocks);
    next();
});

router.get('/remove_broker/:id', cors(corsOptions), (req, res, next) => {
    let id = req.params.id;
    console.log(id);
    res.sendStatus(200);
    stockExchange.removeBroker(id);
    next();
})

router.get('/remove_stock/:id', cors(corsOptions), (req, res, next) => {
    let id = req.params.id;
    res.sendStatus(200);
    stockExchange.removeStock(id);
    next();
})

router.get('/get_params', cors(corsOptions), (req, res, next) => {
    res.json(stockExchange.params);
    res.sendStatus(200);
})

router.post('/add_broker', cors(corsOptions), (req, res, next) => {
    console.log(req.body);
    stockExchange.addBroker(req.body.name, req.body.resources, req.body.imageURL);
    res.sendStatus(200);
    next();
})

router.post('/add_stock', cors(corsOptions), (req, res, next) => {
    console.log(req.body);
    stockExchange.addStock(req.body.name, req.body.distributionLaw, req.body.amount, req.body.maxToChange, req.body.startPrice);
    res.sendStatus(200);
    next();
})

router.post('/edit_broker/', cors(corsOptions), (req, res, next) => {
    console.log(req.body);
    stockExchange.editBroker(req.body);
    next();
})


router.post('/edit_stock/', cors(corsOptions), (req, res, next) => {
    console.log(req.body);
    stockExchange.editStock(req.body);
    next();
})

router.post('/set_params', cors(corsOptions), (req, res, next) => {
    stockExchange.params = req.body;
    stockExchange.save();
    next();
})
