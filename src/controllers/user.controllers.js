import { asyncHandler } from "../utils/asyncHandler.js";
import {apiErrorHandler} from "../utils/apiErrorHandler.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {apiresponse} from "../utils/apiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
   
    //get user details form the fortend
    const {fullName, email, username ,password}=req.body
    console.log("email is: ", email)

    if(
        [fullName,email.username,password].some((field)=>
            field?.trim()==="")
    ){
        throw new apiErrorHandler(400,"all filed are required except cover image")
    }

    // check a user already exist or not

    const userExist= User.findOne({
        $or:[{username},{email}]
    })

    if(userExist){
        throw new apiErrorHandler(409,"user is already existed with this  username or email so try another one");
    }

    //checking for images

    const avatarLocalPath= req.files?.avatar[0]?.path;
    const coverImageLocalPath= req.files?.coverImage[0]?.path;

    // checking a image for avatar
    if(!avatarLocalPath){
        throw new apiErrorHandler(400,"avatar is required field.")
    }

    // uploading the images on cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

    //checking the avatar image is uploaded or not
    if(!avatar){
        throw new apiErrorHandler(400,"something went worng  avatar is required filed and you forget it.")
    }

    // creating a user

    const user= await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase(),
    })

    const createdUser= await User.findOne(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new apiErrorHandler(500,"something went worng while register the user")
    }

    return res.status(201).json(
        new 
    )

} )


export {
    registerUser,
}