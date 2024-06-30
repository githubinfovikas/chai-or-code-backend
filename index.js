import 'dotenv/config'
import express from 'express';
import connectDB from './monngoDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static('public'));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});








connectDB()
    .then(() => {
        app.listen( process.env.PORT || 4000 , () => {
            console.log(`server is running on port http://localhost:${process.env.PORT || 4000}`);
        })
    })
    .catch((error) => console.log(error))