import { registerService, loginService, verifyEmailService, logoutService } from "../services/auth.service.js";

export async function registerController(req, res, next){
    try {
        const {name, email, password} = req.body;
        if(!name||!email||!password){
            return res.status(400).json({message: "Name, email and password are required"})
        }
        const result = await registerService({name,email,password});
        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
}

export async function loginController(req, res, next){
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required."})
        }
        const result = await loginService({email,password});
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function verifyEmailController(req, res, next){
    try {
        const {token} = req.query;
        if(!token){
            return res.status(400).json({message:"Verification token is required."})
        }
        const result = await verifyEmailService(token);
        return res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

export async function logoutController(req, res, next){
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const result = await logoutService(token);
        res.status(200).json(result)
    } catch (err) {
        next(err);
    }
}