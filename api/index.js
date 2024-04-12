import express from 'express'
import connectDB from './config/db.js'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import listingRouter from './routes/listing.route.js'
import {errorMiddleware} from './middlewares/error.middleware.js'
import cookieParser from 'cookie-parser'
import path from 'path'

const __dirname = path.resolve() 

const app = express();
app.use(express.json());
app.use(cookieParser());
connectDB();




app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, '/client/dist/index.html'))
})

app.use(errorMiddleware);





app.listen(3000, () => {
    console.log("Server up and listening on port 3000!")
});