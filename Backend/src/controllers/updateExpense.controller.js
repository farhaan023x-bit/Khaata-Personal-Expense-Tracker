import { Expense } from "../models/expense.model.js"

const updateExpense=async (req,res)=>{
    try{
        const expenseId=req.params.expenseId
        const user=req.user._id

        const updated=await Expense.findOneAndUpdate(
            {
                 _id:expenseId,
                 user:user
            },
            {
                $set:req.body
            },
            {
            new:true
            }
        )

        if(!updated){
            return res.status(404).json({
                message:"Expense Not Found!"
            })
        }

        return res.status(200).json({
            message:"Expense Updated successfully",updatedExpense:updated
        })
    }
    catch(error){
        return res.status(500).json({
            message:"Something went wrong!",error
        })
    }
}

export {updateExpense};