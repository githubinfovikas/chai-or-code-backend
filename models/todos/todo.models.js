import mongoose, { Schema, model } from 'mongoose'

const TodoSchema = new mongoose.Schema({
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
    subTodos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTodo'
    }]
}, { timestamps: true })

export default model('Todo', TodoSchema)
