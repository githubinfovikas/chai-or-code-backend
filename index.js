import express from 'express';
const app = express();
import 'dotenv/config'
import connectDB from './monngoDB.js';
connectDB();

const port = process.env.PORT ;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port,() =>{
    console.log(`server is running on port http://localhost:${port}`);
})