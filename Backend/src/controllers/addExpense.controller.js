import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";

const addExpense=async (req,res)=>{
    const {title,amount,category,description}=req.body;
    const user=await User.findById(req.user._id)

    try{
        if(!user){
            return res.status(404).json({
                message:"User not found"
            })
        }

        const expense=await Expense.create({
            title,
            amount,
            category,
            description,
            user:user._id
        })

        return res.status(201).json({
            message:"Expense Added Successfully!!",expense
        })
    }
    catch(error){
        res.status(500).json({
            message:"Something went wrong",error
        })
    }

}

export {addExpense};

