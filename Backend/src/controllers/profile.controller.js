import { User } from "../models/user.model.js";

const getProfile=async (req,res)=>{
    try{
        const user=await User.findById(req.user._id).select("-password -refreshToken");

        if(!user){
            res.status(401).json({
                message:"User not found!"
            })
        }

        return res.status(200).json({
            message:"User Fetched Successfully!",user

        })

    }
    catch(error){
        res.status(500).json({
            message:"Something went wrong"
        })
    }
    
}

export {getProfile};