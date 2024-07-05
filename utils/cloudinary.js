import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null

        //upload the file on cloud
         const cloudResponse = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        //file has been uploaded on cloud successfully
        console.log("File has been uploaded on cloud successfully", cloudResponse)
        return cloudResponse
    }catch(err){
        console.log(err)
        fs.unlinkSync(localFilePath)        //remove the localy saved file as the uplaod operation failed
        return null;
    }

}


const deleteOnCloudinary = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;

        //delete file from cloudinary
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });
    } catch (error) {
        return error;
        console.log("delete on cloudinary failed", error);
    }
};


export {uploadOnCloudinary,deleteOnCloudinary}