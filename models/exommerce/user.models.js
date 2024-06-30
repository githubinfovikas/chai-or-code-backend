import mongoose  from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        require:[true,"Username is required"],
        unique:true,
        lowercase:true
    },
    email: {
        type:String,
        require:[true,"email is required"],
        unique:true,
        lowercase:true
    },
    password: {
        type:String,
        require:true
    }
},{timestamps:true})


export default User = mongoose.model('User', userSchema);