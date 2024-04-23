import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({

    username:{
        type:String,
        required:ture,
        lowecase:true,
        unique:true,
        trim:ture,
        index:ture
    },
    email:{
        type:String,
        required:ture,
        unique:true,
        trim:true,
        lowecase:ture,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinary url
        required:ture,
    },
    coverimage:{
        type:String, // cloudinary url
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:[true,"password is required"]
    },
    refreshToken:{
        type:String,
    }
    

},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect= async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generatedAccessToken=function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username
    },
    process.env.ACCESS_TOKEN_SCERECT,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

)
}

userSchema.methods.generatedRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
        },
        process.env.REFRESH_TOKEN_SECRECT,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema)