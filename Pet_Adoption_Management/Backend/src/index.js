import express from 'express'
import bodyParser  from 'body-parser';
import cors from 'cors';
import { db } from './database/index.js';
import './models/index.js'; // Ensure all models are registered before sync
import {userRouter, adoptionRouter, favoriteRouter, authRouter, petRouter, adminRouter} from './route/index.js'
import dotenv from 'dotenv'
import messageRouter from './route/message/messageRoute.js';

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

dotenv.config();


const app=express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT || 5000;
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/pets', petRouter);
app.use('/api/adoptions', adoptionRouter);
app.use('/api/favorites', favoriteRouter);  
app.use('/api/admin', adminRouter);
app.use('/api/message', messageRouter);

app.listen(port, async function() {
  console.log(`Project running on port ${port}`);
  try {
    await db();
  } catch (error) {
    console.error("Failed to start server due to database connection error:", error);
    process.exit(1);
  }
});