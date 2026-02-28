import express from "express";
import cors from "cors";
import CookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
import projectRouter from "./routes/project.routes.js";
import userRouter from "./routes/user.routes.js";
const app = express();

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS,
    credentials: true
}

//Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(CookieParser())
app.use("/api/auth", authRouter)
app.use("/api/projects", projectRouter)
app.use("/api/users",userRouter)
app.use(errorMiddleware);
export default app;