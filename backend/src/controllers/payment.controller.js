import { createOrder, verifyPayment } from "../services/payment.service.js";

export async function createOrderController(req, res, next){
    try {
        const {planId} = req.body;
        if(!planId) return res.status(400).json({error: "Plan ID is required."});

        const result = await createOrder({userId: req.user.userId, planId});
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

export async function verifyPaymentController(req, res, next){
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature} = req.body;
        if(!razorpayOrderId|| !razorpayPaymentId || !razorpaySignature){
            return res.status(400).json({
                message: "Missing payment details"
            });
        }
        const result = await verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature, userId: req.user.userId});
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}