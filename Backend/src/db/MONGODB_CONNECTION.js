import mongoose from "mongoose"

const connectDB=async ()=>{
    try{
        const connectionInstance=await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MONGODB CONNECTED SUCCESSFULLY!!:${connectionInstance.connection.host}`)
    }
    catch(error){
        console.log("CONNECTION Failed!",error)
        process.exit(1);
    }
    
}

export default connectDB;