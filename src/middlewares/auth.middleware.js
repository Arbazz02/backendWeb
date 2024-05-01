import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"


export const verifyjwt= asyncHandler( async( req , _ , next )=>{

    try {
        const token = req.cookies?.accessToken || req.header
        ( "Authorization" )?.replace( "Bearer " , "" )
    
        if(!token){
            throw new ApiError(405,"unAuthorized request")
        }
        
        const decodedToken=  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)    
    
        const user=User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            // discuss about frontend
            throw new ApiError(401,'Invalid access Token')
        }
    
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(405,error?.message || "invalide access token")
    }

})