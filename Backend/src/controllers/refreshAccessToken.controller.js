import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const refreshAccessToken=async (req,res)=>{
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
                message:"User not found!"
            })
        }

        console.log(decoded);
        console.log(user);

        const newAccessToken=jwt.sign(
            {
                _id:user._id,
                email:user.email
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn:"7d"
            }
        )

        res.status(200).json({
            message:"access token refreshed",
            accessToken:newAccessToken
        })
    }

    catch(error){
        res.status(401).json({
            message:"Invalid or expired refresh token",error
        })
    }
}

export {refreshAccessToken}