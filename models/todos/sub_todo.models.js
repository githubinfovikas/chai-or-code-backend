import mongoose  from "mongoose";

const subTodoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [5, 'Content should be at least 5 characters']
    },
    complete: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

},{timestamps:true})


export const SubTodo = mongoose.model("SubTodo",subTodoSchema);

