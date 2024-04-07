import mongoose from 'mongoose'

import dotenv from 'dotenv'
dotenv.config();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED WITH MONGO DB SUCCESSFULLY: " + conn.connection.host);
    } catch (error) {
        console.log(`MONGO DB CONNECTION ERROR: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;


