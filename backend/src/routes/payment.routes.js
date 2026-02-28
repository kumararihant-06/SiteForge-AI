import {Router} from "express";
import {authenticate} from "../middleware/auth.middleware.js"
import { createOrderController, verifyPaymentController } from "../controllers/payment.controller.js";
const paymentRouter = Router();

paymentRouter.use(authenticate);

paymentRouter.post("/create-order", createOrderController);
paymentRouter.post("/verify", verifyPaymentController);

export default paymentRouter