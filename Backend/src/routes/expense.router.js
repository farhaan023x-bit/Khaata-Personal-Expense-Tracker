import express from "express"
import { addExpense } from "../controllers/addExpense.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getExpense } from "../controllers/getExpense.controller.js";
import { deleteExpense } from "../controllers/deleteExpense.controller.js";
import { updateExpense } from "../controllers/updateExpense.controller.js";
import { getExpenseSummary } from "../controllers/getExpenseSummary.controller.js";

const expenseRouter=express.Router();

expenseRouter.post("/addExpense",verifyJWT,addExpense);
expenseRouter.get("/getExpense",verifyJWT,getExpense);
expenseRouter.delete("/deleteExpense/:expenseId",verifyJWT,deleteExpense)
expenseRouter.put("/updateExpense/:expenseId",verifyJWT,updateExpense)
expenseRouter.get("/summary",verifyJWT,getExpenseSummary)

export default expenseRouter;
