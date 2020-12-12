import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { createConnection } from 'typeorm';
import bodyParser from 'body-parser';

import indexRoutes from './routes/index.routes';

const app = express();
createConnection();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

//routes
app.use(indexRoutes);

app.listen(3000);
console.log('Server port', 3000);
