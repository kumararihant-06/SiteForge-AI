import { Router } from "express";
import { loginUserController, registerUserController } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/auth/register", registerUserController);
authRouter.post("/auth/login", loginUserController);

export default authRouter;