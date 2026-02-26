import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middleware/error.middleware.js";
import authRouter from "./routes/auth.routes.js";
const app = express();

const corsOptions = {
    origin: process.env.TRUSTED_ORIGINS,
    credentials: true
}

//Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(errorMiddleware);

app.use("/api", authRouter)

export default app;