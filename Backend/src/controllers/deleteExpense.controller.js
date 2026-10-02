
import { Expense } from "../models/expense.model.js";

const deleteExpense=async (req,res)=>{
    try{

        const expenseId=req.params.expenseId;

        const deleted=await Expense.findOneAndDelete({
            _id:expenseId,
            user:req.user._id
        })

        if(!deleted){
            return res.status(404).json({
                message:"Expense not found"
            })
        }

        return res.status(200).json({
            message:"Expense deleted successfully!",deleted
        })
    }

    catch(error){
        return res.status(500).json({
            message:"Something went wrong",error
        })
    }
}

export {deleteExpense}