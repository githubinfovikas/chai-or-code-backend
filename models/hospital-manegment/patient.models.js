import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    diagonseWith:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    bloodGroup:{
        type:String,
    },
    gender:{
        type:String,
        enum:["M","F","O"],
        require:true
    },
    admittedIn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital'
    }

},{timestamps:true})


export const Patient = mongoose.Schema('Patient',medicalRecordSchema)