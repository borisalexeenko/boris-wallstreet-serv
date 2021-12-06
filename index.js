import express from 'express';
import { router } from './api-routing.js';
import bodyParser from "body-parser";

export var app = express();


app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
// app.use(cors);
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// мидлвейр для роутинга
app.use('/', router);
const PORT = process.env.PORT ?? 3300;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
