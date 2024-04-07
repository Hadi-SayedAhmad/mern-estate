import express from 'express'
import connectDB from './config/db.js'
import userRouter from './routes/user.route.js'
const app = express();
connectDB();




app.use("/api/user", userRouter);









app.listen(3000, () => {
    console.log("Server up and listening on port 3000!")
});