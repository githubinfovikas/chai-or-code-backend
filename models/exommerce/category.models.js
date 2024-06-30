import mongoose from "mongoose";

const categorySchama = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },


},{timestamps:true})


export default Category = mongoose.model('Category', categorySchama)