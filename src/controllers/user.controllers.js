import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/apiErrorHandler.js"
import {User} from "../models/user.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt, { verify } from "jsonwebtoken"
import mongoose from "mongoose";


const generateAccessAndRefreshTokens= async(userId)=>{
    try {
       const user= await User.findById(userId)
       if(!user){
        throw new ApiError(400,"user is not found")
       }
       const accessToken=user.generateAccessToken()
       const refreshToken=user.generateRefreshToken()

       user.refreshToken=refreshToken
       await user.save({ validateBeforeSave: false})

       return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500, error?.message ||"something went wrong while generationg tokens")
    }
}


const registerUser = asyncHandler( async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const {fullName, email, username, password } = req.body
    
    // console.log(req.body)
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;
    // console.log(req.files)

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    
        if(!avatarLocalPath){
            throw new ApiError(400,"requried avatar file");
        }
  

    const Avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!Avatar) {
        throw new ApiError(400, "Avatar file is required")
    }
   

    const user = await User.create({
        fullName,
        avatar: Avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )

} )

const loginUser=asyncHandler(async (req,res)=>{

    // data  from req.body
    //check user with username or email\
    // find the user
    //password check
    //accesstoken and refresh token
    //send cookie

    const {username,email,password}=req.body

    if(!(username && email)){
        throw new ApiError(400,"username or email is required to login")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if(!user){
        throw new ApiError(402,"user is not register")
    }

   const isPasswordValid= await user.isPasswordCorrect(password)

   if(!isPasswordValid){
        throw new ApiError(404,"password is incorrect(CREDENTIALS) please  try again ")
   }

   const {refreshToken,accessToken} = await generateAccessAndRefreshTokens(user._id)

   const LoggedInUser= await User.findById(user._id).
   select("-password -refreshToken")

   const option= {
        httpOnly:true,
        secure:true
   }

   return res
   .status(200)
   .cookie("accessToken", accessToken , option)
   .cookie("refreshToken", refreshToken, option)
   .json(
    new ApiResponse(
        200,
        {
            user:LoggedInUser,accessToken,refreshToken
        },
        "user loggedIn SuccessFully"
    )
   )

})


const logOutUser = asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const option={
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken", option)
    .json(
        new ApiResponse(
            200,
            {},
            "User  Loged Out Succesfully"
        )
    )
})

const refreshAccessToken= asyncHandler(async (req,res)=>{
    const inComingRefreshToken=req.cookies.accessToken || req.body.refreshToken

    if(!inComingRefreshToken){
        throw new ApiError(400,"User is unaurthorized!!")
    }

    try {
        const decodedToken=jwt.verify(inComingRefreshToken,process.env.REFRESH_TOKEN_SECRET )
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
    
        if(inComingRefreshToken !== user?.refreshToken ){
            throw new ApiError(403,"Refresh Token is used or Expired!! we can't do any thing now. you have to login again!!")
        }
    
        const option={
            httpOnly:true,
            secure:true
        }
    
        const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",newRefreshToken,option)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newRefreshToken},
                "Access token is refresh Succefully...."
            )
        )
    } catch (error) {
        throw new ApiError(400, error?.message || "Invalid refresh token")
    }
})

const changeCurrentPassword = asyncHandler( async(req,res)=>{
    const {oldPassword, newPassword, confirmedPassword}= req.body;

    if(newPassword!==confirmedPassword){
        throw new ApiError(405,"try again! password are not match...");
    }

    const user=await User.findById(req.user?._id);

   const ispasswordCorrectornot= user.isPasswordCorrect(oldPassword)

   if(!ispasswordCorrectornot){
        throw new ApiError(400,"Password is incorrect try agian ...");
   }

   user.password=newPassword
   await user.save({validateBeforeSave:false})

   return res
   .status(200)
   .json(
    new ApiResponse(200,{},"Your Password has been Changed Successfully..")
   )

})

const getCurrentUser= asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200, req.user, "current user fetched successfully.")
})

const UpdateAccountDetails= asyncHandler(async(req,res)=>{

    const {fullName,email}= req.body;
    
    if(!fullName || !email){
        throw new ApiError(400,"fullname and email is required to update")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                fullName,
                email
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"updated account sucessfully!!")
    )
})

const UpdateUserAvatar=  asyncHandler(async(req,res)=>{

    const avatarLocalPath= req.file?.path;
    
    if(!avatarLocalPath){
        throw new ApiError(400,'No image provided')
    }

    const avatar= await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(401, "Image could not be uploaded in cloudinary");
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"avatar is uploaded")
    )
})

const updateUserCoverImage = asyncHandler(async(req,res)=>{
    const localpath= req.file?.path

    if(!localpath){
        throw new ApiError(400,"cover image is missing!!")
    }

    const coverimage=await uploadOnCloudinary(localpath)
    if(!coverimage.url){
        throw new ApiError(400,"feshing the error while uploading the cover image on  Cloudinary")
    }

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverimage.url
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200,user, "cover Image is Uploaded")
    )

})
export{
    registerUser,
    loginUser,
    logOutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    UpdateAccountDetails,
    UpdateUserAvatar,
    updateUserCoverImage
}