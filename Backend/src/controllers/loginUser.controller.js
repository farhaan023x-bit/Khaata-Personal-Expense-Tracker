import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const loginUser=async (req,res)=>{

    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({
                message:"User Not Found! Please Register First!"
            })
        }

        if(!email){
            return res.status(400).json({
                message:"email Required"
            })
        }

        if(!password){
            return res.status(400).json({
                message:"password Required"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
           return res.status(400).json({
           message:"Incorrect Password!"
    })
}  

    const accessToken=jwt.sign(
        {
        _id:user._id,
        email:user.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"1d"}
)

    const refreshToken=jwt.sign(
        {
        _id:user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:"30d"
        }
    
    )

    user.refreshToken=refreshToken;
    await user.save();

    res.cookie("refreshToken",
        refreshToken,
        {httpOnly:true}
    );

        res.status(200).json({
        message:"Login Successfull!",
        accessToken:accessToken
    })
        


    }
    catch(error){
        res.status(500).json({
            message:"Something went wrong"
        })
    }
}

export {loginUser};