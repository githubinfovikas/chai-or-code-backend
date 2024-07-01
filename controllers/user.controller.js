import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import {User} from '../models/utube/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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
    const {username,fullname,password,email} = req.body
    console.log(req.body)
    //step 2
    if(!username || !fullname || !password || !email){
        throw new ApiError(400,"All fields are required")
    }

    //step 3
    const existedUser = await User.findOne(
        {
            $or:[
                {username},
                {email}
            ]
        }
    )
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    //step 4
    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
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
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })
 

    //step 7

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    //step 8
    if(!createdUser){
        throw new ApiError(400,"User not created something went wrong")
    }



    //step 9

    return res.status(201).json(
        new ApiResponse(200,createdUser,"User created successfully")
    )




})


const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken")
    return res.status(200).json(
        new ApiResponse(200,users,"Users fetched successfully")
    )
})



export {registerUser,getAllUsers}