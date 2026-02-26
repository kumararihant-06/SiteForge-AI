import { Router } from "express";
import { loginUserController, registerUserController, verifyEmailController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/auth/register", registerUserController);
authRouter.post("/auth/login", loginUserController);
authRouter.get("/auth/verify-email", verifyEmailController);
export default authRouter;