import mongoose from "mongoose";
import {DB_NAME} from './constant.js';

const connectDB = async () => {
    // console.log(`MongoDB_URI: ${process.env.MONGODB_URI}/${DB_NAME}`)                         //for testing perpose
    try {
        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`)
        process.exit(1)
    }
}


export default connectDB