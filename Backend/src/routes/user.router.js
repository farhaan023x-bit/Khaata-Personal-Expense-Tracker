import express from "express"
import { registerUser } from "../controllers/user.controller.js";
import { loginUser } from "../controllers/loginUser.controller.js";
import { getProfile} from "../controllers/profile.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { refreshAccessToken } from "../controllers/refreshAccessToken.controller.js";
import { logoutUser } from "../controllers/logoutUser.controller.js";

const userRouter=express.Router();

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/profile",verifyJWT,getProfile)
userRouter.post("/refresh-token",refreshAccessToken)
userRouter.post("/logout",logoutUser)

export default userRouter;