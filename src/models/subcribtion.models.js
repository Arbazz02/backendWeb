import mongoose, { model } from "mongoose";

const subscriberSchema = new mongoose.Schema({

    subscriber:{
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
    },
    channel:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})




export const Subcripton = model.mongoose("Subcripton",subscriberSchema)