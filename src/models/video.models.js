import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const VideoSchema= new mongoose.Schema({

    videoFile:{
        type:String, //cloudinary url
        required:[true,"video is required for  upload"]
    },
    thumbnail:{
        type:String, // cloudinary url
        required:ture,

    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,// in minutes / cloudinary url
        required:true
    },
    views:{
        type:Number,
        default: 0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owener:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

},{timestamps:true})

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",VideoSchema)