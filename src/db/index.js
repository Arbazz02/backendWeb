import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB= async ()=>{
    try{
       const connectionOfdb= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       console.log(`mongoose DATABASE is CONNECTED!!!! : ${connectionOfdb.connection.host}`)
    }catch(error){
        console.log("Error while connecting to the database", error);
        process.exit(1);
    }
}

export default connectDB