import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        require:true
    }

})


const orderSchema = new mongoose.Schema({
    orderPrice:{
        type: Number,
        required: true

    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    orderItems:{
        type:[orderItemSchema]
    },
    address:{
        type: String,
        required: true
    },
    status:{
        type:String,
        enum:["PENDING","SHIPPED","DELIVERED","CANCELED"],
        default:"PENDING"
    }

},{timestamps:true})


export default Order = mongoose.model('Order', orderSchema)