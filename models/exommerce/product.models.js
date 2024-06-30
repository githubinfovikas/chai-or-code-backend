import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Description is required'],
        minlength: [5, 'Description should be at least 5 characters']

    },
    name:{
        type: String,
        required: [true, 'Name is required'],
    },
    productImage: {
        type: String,
        required: [true, 'Image is required'],
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    stock:{
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required'],
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

},{timestamps:true})

const Product = mongoose.model('Product', productSchema)