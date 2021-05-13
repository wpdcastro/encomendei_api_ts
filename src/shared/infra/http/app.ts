/* eslint-disable import/no-extraneous-dependencies */
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import 'reflect-metadata';
import createConnection from '../typeorm';
import router from './routes/index';

createConnection();
const app = express();
app.use(express.json());

app.use(router);

export { app };
