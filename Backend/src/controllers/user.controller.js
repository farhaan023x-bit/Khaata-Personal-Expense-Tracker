import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"

const registerUser=async (req,res)=>{
    try{
        const {username,email,password}=req.body;

        if(!username || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            username,
            email,
            password:hashedPassword
        })
       return res.status(201).json({
            message:"User Registered",user
        });
    }
    catch(error){
        res.status(500).json({
            message:error.message
        })
    }
}

export {registerUser};