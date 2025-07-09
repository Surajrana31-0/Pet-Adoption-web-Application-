import express from 'express'
import bodyParser  from 'body-parser';
import cors from 'cors';
import { db } from './database/index.js';
import './models/index.js'; // Ensure all models are registered before sync
import {userRouter, adoptionRouter, favoriteRouter, authRouter, petRouter} from './route/index.js'
import dotenv from 'dotenv'

dotenv.config();


const app=express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/pets', petRouter);
app.use('/api/adoptions', adoptionRouter);
app.use('/api/favorites', favoriteRouter);

app.listen(port, function() {
  console.log(`Project running on port ${port}`);
  db();
});