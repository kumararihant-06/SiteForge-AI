import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCreditsController, getProfileController } from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.use(authenticate)

userRouter.get("/profile",getProfileController)
userRouter.get("/credits",getCreditsController)

export default userRouter