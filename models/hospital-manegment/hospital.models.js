import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        require:true
    },
    specilizedIn:[
        {type:String}
    ],
    likes:{
        type:Number,
        default:0
    }
},{timestamps:true})


export const Hospital = mongoose.Schema('Hospital',medicalRecordSchema)