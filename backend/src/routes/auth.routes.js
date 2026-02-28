import { Router } from "express";
import { loginController, logoutController, registerController, verifyEmailController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/verify-email", verifyEmailController);
authRouter.post("/logout",logoutController)
export default authRouter;