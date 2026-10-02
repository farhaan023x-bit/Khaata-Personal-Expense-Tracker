import { Expense } from "../models/expense.model.js";

const getExpense=async (req,res)=>{
    try{
        const user=req.user._id;
        const page=parseInt(req.query.page) || 1;
        const limit=parseInt(req.query.limit) || 5;
        const skip=(page-1)*limit;

        const filter={user:user}

        if(req.query.category){
            filter.category=req.query.category
        }

        let sort={};

        if(req.query.sort==="amount"){
            sort.amount=1;
        }else if(req.query.sort==="date"){
            sort.createdAt=1;
        }

        const allExpenses=await Expense.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit);

        const totalExpenses=await Expense.countDocuments(filter)

        const totalPages=Math.ceil(totalExpenses/limit);

        return res.status(200).json({
            allExpenses,
            page,
            limit,
            totalExpenses,
            totalPages
        })
    }
   
    catch(error){
        return res.status(500).json({
            message:"Something went wrong",error
        })
    }
}

export {getExpense}