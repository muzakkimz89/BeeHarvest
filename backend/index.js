import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth.js';
import placeRoute from './routes/place.js';
import boxRoute from './routes/box.js';
import harvestRoute from './routes/harvest.js';
dotenv.config()

const app = express();

const uri = process.env['MONGODB_URI']
const port  =5000;

const connect = async () =>{
    try{
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');
    } catch(err){
        throw err;
    }
}

// const printCurrentTime = () => {
//     const currentTime = new Date().toLocaleTimeString();
//     console.log("Current time:", currentTime);
//   };
  
//   // Function to repeat the printing every 4 minutes
//   const repeatFunction = (func, interval) => {
//     // Call the function immediately
//     func();
  
//     // Set interval to repeat the function every specified time
//     setInterval(func, interval);
//   };
  
//   // Usage: Repeat printCurrentTime every 4 minutes (4 * 60 * 1000 milliseconds)
//   repeatFunction(printCurrentTime, 4 * 60 * 1000);

mongoose.connection.on('disconnected', () => {
    console.log('MongoDb disconnected')
})
mongoose.set('strictQuery', true);


app.use(cors())
app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization,');
    next();
  })

app.use("/api/v1/auth", authRoute)
app.use("/api/v1/place", placeRoute)
app.use("/api/v1/box", boxRoute)
app.use("/api/v1/harvest", harvestRoute)

app.listen(port,() => {
    connect();
    console.log(`listening on http://localhost:${port}`);
})