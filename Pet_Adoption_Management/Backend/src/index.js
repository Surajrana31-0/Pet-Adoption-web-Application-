import express from 'express'
import bodyParser  from 'body-parser';
import cors from 'cors';
import { db } from './database/index.js';
import {userRouter} from './route/index.js'
import dotenv from 'dotenv'
import { authRouter } from './route/auth/authRoute.js';

dotenv.config();


const app=express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.listen(port, function() {
  console.log(`Project running on port ${port}`);
  db();
});