import { Router } from "express";
import { UpdateAccountDetails, UpdateUserAvatar, changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, logOutUser, loginUser, refreshAccessToken, registerUser, updateUserCoverImage } from "../controllers/user.controllers.js";
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyjwt } from "../middlewares/auth.middleware.js";


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)

//secured route
router.route("/logout").post( verifyjwt ,logOutUser)

router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyjwt,changeCurrentPassword)

router.route("/current-user").get(verifyjwt,getCurrentUser)

router.route("/update-account").patch(verifyjwt,UpdateAccountDetails)

router.route("/avatar").patch(verifyjwt,upload.single("avatar"),UpdateUserAvatar)

router.route("/coverImage").patch(verifyjwt,upload.single("coverImage"),updateUserCoverImage)

router.route("/c/:usename").get(verifyjwt,getUserChannelProfile)

router.route("/history").get(verifyjwt,getWatchHistory)

export default router