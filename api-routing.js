import express from 'express';
import { StockExchange } from './models/stock-exchange.js'
import cors from 'cors';

let stockExchange = new StockExchange();

export const router = express.Router();

let corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 200
}

router.get('/', cors(corsOptions), (req, res, next) => {
    res.json({'greetings': 'Hello!'});
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
    stockExchange.addStock(req.body.name, req.body.distributionLaw, req.body.maxToChange, req.body.startPrice);
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
