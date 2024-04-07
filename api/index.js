import express from 'express'
import connectDB from './config/db.js'
const app = express();
connectDB();














app.listen(3000, () => {
    console.log("Server up and listening on port 3000!")
});