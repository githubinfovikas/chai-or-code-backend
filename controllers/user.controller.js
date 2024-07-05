import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from '../models/utube/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (err) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    //step 1 : get data from request body
    //step 2 : validate data (user data correct beja hai ya nhi like empty nhi n bej diya )
    //step 3 : check if user already exists
    //step 4 : check for images, check for avatar
    //step 5 : if avatar avaliable then upload to cloud
    //setp 6 : create user object in db
    //step 7 : remove password and refresh token field form res
    //step 8 : check for user creation ya not
    //step 9 : return response

    //step 1
    const { username, fullname, password, email } = req.body
    console.log(req.body)
    //step 2
    if (!username || !fullname || !password || !email) {
        throw new ApiError(400, "All fields are required")
    }

    //step 3
    const existedUser = await User.findOne(
        {
            $or: [
                { username },
                { email }
            ]
        }
    )
    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    //step 4
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    //step 5
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    //step 6
    const user = await User.create({
        username,
        fullname,
        password,
        email,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })


    //step 7

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    //step 8
    if (!createdUser) {
        throw new ApiError(400, "User not created something went wrong")
    }



    //step 9

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )




})


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken")
    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    )
})


const loginUser = asyncHandler(async (req, res) => {

    //step 1
    const { username, email, password } = req.body

    //step 2
    if (!username && !email) {
        throw new ApiError(400, "username or email are required")
    }

    //step 3
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    //step 4
    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(400, "Password is incorrect")
    }

    //step 5
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    //step 6
    const loggeedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("login user ", loggeedInUser)
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200,
                {
                    user: loggeedInUser, accessToken, refreshToken
                },

                "User loggedIn in successfully")
        )

})


const logoutUser = asyncHandler(async (req, res) => {

    //step 1 : check for access token and refresh token

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )


    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(200, {}, "User logged out successfully")
        )

})


const refreshAccessToken = asyncHandler(async (req, res) => {

    //step 1 : check for access token and refresh token
    const { incomingRefreshToken } = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(400, "unauthorized token")
    }

    //step 2 : verify refresh token

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if (!user) {
            throw new ApiError(404, "Invalid refresh token")
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token expired or used")
        }


        //step 3 : generate new access token and refresh token
        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id)

        return res
            .status(200)
            .cokkie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully")
            )
    } catch (err) {
        throw new ApiError(500, err?.message || "Something went wrong while refreshing access token")
    }


})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldpassword, newPassword } = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldpassword)
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Old password is incorrect")
    }

    user.password = newPassword
    user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Password changed successfully"))


})


const getCurrentUser = asyncHandler(async (req, res) => {

    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User fetched successfully"))

})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullname, email } = req.body
    if (!fullname || !email) {
        throw new ApiError(400, "fullname and email are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullname, email
            }
        },
        { new: true }

    ).select("-password")

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User updated successfully"))
})

const updateUserAvatar = asyncHandler(async (req, res) => {
    const avatarLocalPath = req.file?.path
    if (!avatarLocalPath) {
        new ApiError(400, "Avatar file missing")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while upload on avatar")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { avatar: avatar.url }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(
            ApiResponse(200, user, "Avatar Image update")
        )

})

const updateUserCoverImage = asyncHandler(async (req, res) => {
    const coverImageLocalPath = req.file?.path
    if (!coverImageLocalPath) {
        new ApiError(400, "cover Image file missing")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error while upload on cover Image")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: { coverImage: coverImage.url }
        },
        { new: true }
    ).select("-password")

    return res.status(200)
        .json(
            new ApiResponse(200, user, "Cover Image Update successfully")
        )

})

const getUserChannelProffile = asyncHandler(async (req, rew) => {
    const { username } = req.params;
    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: { username: username?.toLowerCase() }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreginField: "channel",
                as: "subscriptions"
            }
        },
        {
            $lookup: {
                form: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"

            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscriptions" },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSuscribed: {
                    $cond: {
                        if: { $in: [req.user?._id, "subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullname: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                avatar: 1,
                coverImage: 1,
                email: 1,
                isSuscribed: 1

            }
        }

    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res.status(200)
        .json(new ApiResponse(200, channel[0], "user channel fetch sucessffully"))
})


const getWatchHistory = asyncHandler(async (req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {

                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200, user[0].watchHistory, "watch history fetch successfully"))
})



export {
    generateAccessAndRefreshToken,
    registerUser,
    getAllUsers,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProffile,
    getWatchHistory
}