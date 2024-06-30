import mongoose from "mongoose";

const DoctorSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    salary:{
        type:String,
        require:true
    },
    qualification:{
        type:String,
        require:true
    },
    experienceInYears:{
        type:Number,
        default:0
    },
    worksInHospitals:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hospital'
        }
    ]

},{timestamps:true})


export const Doctor = mongoose.Schema('Doctor',medicalRecordSchema)