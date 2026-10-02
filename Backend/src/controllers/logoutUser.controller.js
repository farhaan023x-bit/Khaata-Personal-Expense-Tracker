import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const logoutUser=async (req,res)=>{
    const refreshToken=req.cookies?.refreshToken;

    try{
        if(!refreshToken){
            res.status(401).json({
                message:"Refresh token not found"
            })
        }

        const decoded=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const user= await User.findById(decoded._id);

        if(!user){
            res.status(401).json({
                message:"User not found"
            })
        }

        user.refreshToken=undefined;
        await user.save();
        res.clearCookie("refreshToken");

        return res.status(200).json({
            message:"Logout Successfully!!"
        })
    }

    catch(error){
        res.status(401).json({
            message:"Logout Failed!",error
        })
    }
}

export {logoutUser};