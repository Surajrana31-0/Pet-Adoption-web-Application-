import express from 'express'
import bodyParser  from 'body-parser';
import { db } from './database/index.js';
import {userRouter} from './route/index.js'
import dotenv from 'dotenv'

dotenv.config();


const app=express();
app.use(
  cors({
    origin:"http://localhost:3000",
    credentials:true,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
  })
);

const port=process.env.PORT||5000
app.use(bodyParser.json());
app.use('/api/users',userRouter)

app.listen(5000,function(){
  console.log("project running in port ")
  db()
})