import mongoose from "mongoose";


const subTodoSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    email: {
        type: String,
        required: true,
        unique:true,
        lowercase:true
    },
    password: {
        type: String,
        required: [true,"Password is required"], 
    }
},{timestamps:true})


export default User = mongoose.model('SubTodo', subTodoSchema)