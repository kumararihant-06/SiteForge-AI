import Razorpay from "razorpay";
import crypto from "crypto";
import {prisma } from "../prisma/client.js";
import {v4 as uuidv4 } from "uuid";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const PLANS = {
    basic: { credits: 100, amount:49900, currency: "INR"},
    pro: { credits: 400, amount:189900, currency: "INR"},
    enterprise: { credits: 1000, amount: 499900, currency: "INR"}
}

export async function createOrder({userId, planId}){
    const plan = PLANS[planId];

    if(!plan){
        const error = new Error("Invalid plan selected.");
        error.status = 400;
        throw error;
    }

    // Create order with razorpay
    const order = await razorpay.orders.create({
        amount: plan.amount,
        currency: plan.currency,
        receipt: `rcpt_${uuidv4().replace(/-/g, "").slice(0, 35)}`,
        notes: {
            userId,
            planId,
            credits: plan.credits
        }
    });

    // Save transaction record as unpaid
    await prisma.transaction.create({
        data: {
            id: uuidv4(),
            userId,
            planId,
            amount: plan.amount /100,
            credits: plan.credits,
            isPaid: false
        }
    });

    return {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
    }

}

export async function verifyPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature, userId}){

    //verify the signature to confirm payment came from razorpay

    const body = razorpayOrderId + "|" + razorpayPaymentId;

    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if(expectedSignature !== razorpaySignature){
        const error = new Error("Invalid payment signature. Payment verification failed.");
        error.status = 400;
        throw error;
    }

    //fetch the order from razorpay to get credits
    const order = await razorpay.orders.fetch(razorpayOrderId);
    const {planId, credits} = order.notes;

    //mark transaction as paid
    await prisma.transaction.updateMany({
        where: {id: userId, planId, isPaid: false},
        data: {isPaid: true}
    });

    //add credits to user
    await prisma.user.update({
        where: {id: userId},
        data: { credits: {
         increment: parseInt(credits)
        }}
    });

    return { message: "Payment completed. Credits added.", credits: parseInt(credits)};
}