import { Expense } from "../models/expense.model.js";
import mongoose from "mongoose";


const getExpenseSummary=async (req,res)=>{
    try{
      
        const user=new mongoose.Types.ObjectId(req.user._id);
    
        const summary=await Expense.aggregate([
            {
                $match:{
                    user:user
                }
            },
            {
                $group:{
                    _id:null,
                    totalExpense:{ $sum: "$amount"},
                    expenseCount:{ $sum: 1}
                }
            }
           
        ]);

        const categorySummary=await Expense.aggregate([
            {
                $match:{
                    user:user
                }
            },
            {
                $group:{
                    _id:"$category",
                    total:{ $sum: "$amount"}
                    
                }
            }
        ])


        return res.status(200).json({
            totalExpense:summary[0]?.totalExpense || 0,
            expenseCount:summary[0]?.expenseCount || 0,
            categorySummary
        })

    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong",error
        })
    }
}

export {getExpenseSummary}