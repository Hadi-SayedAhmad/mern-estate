import express from 'express'
import connectDB from './config/db.js'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import {errorMiddleware} from './middlewares/error.middleware.js'
const app = express();
app.use(express.json());
connectDB();




app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);


app.use(errorMiddleware);





app.listen(3000, () => {
    console.log("Server up and listening on port 3000!")
});