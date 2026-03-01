import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { deleteAccountController, getCreditsController, getProfileController,  updateNameController, updatePasswordController } from "../controllers/user.controller.js";


const userRouter = Router();

userRouter.use(authenticate)

userRouter.get("/profile",getProfileController)
userRouter.get("/credits",getCreditsController)
userRouter.put("/update-name", updateNameController),
userRouter.put("/update-password", updatePasswordController)
userRouter.delete("/delete-account", deleteAccountController)

export default userRouter