import mongoose from "mongoose"

const expenseSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },

    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0.01,"Amount must be greater than 0"]
    },
    category:{
        type:String,
        required:true
    },
    description:{
        type:String,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export const Expense=mongoose.model("Expense",expenseSchema)