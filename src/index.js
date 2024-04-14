import mongoose  from "mongoose";
import { DB_NAME } from "./constants.js";
import dotenv from 'dotenv';
import express from 'express'
import connectDB from "./db/index.js";
const app=express();
dotenv.config({path:"./env"})





connectDB();








//this is the first approch 
/*
;( async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        app.on("error",(error)=>{
            console.log("your application is not able to talk to the database");
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`your app is running at port: ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.error("Error connecting to database: ", error);
        throw error
    }

})

*/