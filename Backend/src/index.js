import app from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/MONGODB_CONNECTION.js"

dotenv.config()

connectDB()

app.listen(process.env.PORT,()=>{
    console.log(`Server is Running on Port:${process.env.PORT}`);
})

