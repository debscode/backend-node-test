import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';

import indexRoutes from './routes/index.routes';
import { redisCache } from "./middlewares/redis";

const app = express();
createConnection();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(redisCache);

//routes
app.use(indexRoutes);

app.listen(3000);
console.log('Server on port', 3000);
