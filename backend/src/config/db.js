import mongoose from "mongoose"
import { ENV } from "./env.js"

export const connectDB = async () => {
    try{
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log(`Connected to DB: ${conn.connection.host}`)
    }catch (error) {
        console.log("DB connection failed ❌")
        process.exit(1) //1: fail, 0: success
    }

}
