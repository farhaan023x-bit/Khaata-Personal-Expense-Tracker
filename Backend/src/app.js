import express from "express"
import cors from "cors"
import userRouter from "./routes/user.router.js";
import cookieParser from "cookie-parser";
import expenseRouter from "./routes/expense.router.js";

const app=express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send("SERVER is Running")
})


app.use("/api/v1/users",userRouter);
app.use("/api/v1/expenses",expenseRouter);



export default app;