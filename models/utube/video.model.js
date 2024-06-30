import { mongoose,Schema } from "mongoose";
import mongooseAutoPopulate from 'mongoose-aggregate-paginate-v2';



const videoSchema = new Schema({
    videoFile: {
        type: String,           // use cloudinary url
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    },
    isPublished:{
        type:Boolean,
        default:true
    },
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},{timestamps:true})


videoSchema.plugin(mongooseAutoPopulate)

export const Video = mongoose.model('Video',videoSchema);