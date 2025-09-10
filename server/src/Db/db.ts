import mongoose from 'mongoose';


export const connectDb = async ()=>{
    try {
        const mongoUrl = process.env.MONGOBD_URL;
        if (!mongoUrl) {
            throw new Error("MONGOBD_URL environment variable is not defined");
        }
        await mongoose.connect(mongoUrl);
        // Database connected successfully
    } catch (error) {
      // Database connection failed  
    }
}