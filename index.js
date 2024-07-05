import 'dotenv/config'
import express from 'express';
import connectDB from './monngoDB.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(express.static('public'));

app.use(cookieParser());




//routers import
import userRouter from './routers/user.router.js';
import commentRouter from './routers/comment.router.js';
import dashboardRouter from './routers/dashboard.router.js';
import healthcheckRouter from './routers/healthcheck.router.js';
import likeRouter from './routers/like.router.js';
import playlistRouter from './routers/playlist.router.js';
import videoRouter from './routers/video.router.js';
import subscriptionRouter from './routers/subscription.router.js';
import tweetRouter from './routers/tweet.router.js';



//routers declaration
app.use('/api/v1/user', userRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/healthcheck', healthcheckRouter);
app.use('/api/v1/like', likeRouter);
app.use('/api/v1/playlist', playlistRouter);
app.use('/api/v1/video', videoRouter);
app.use('/api/v1/subscription', subscriptionRouter);
app.use('/api/v1/tweet', tweetRouter);


app.get('/', (req, res) => {
    res.send('Hello World!');
});



connectDB()
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`⚙️ Server is running on port http://localhost:${process.env.PORT || 3000}`);
        })
    })
    .catch((error) => console.log(error))