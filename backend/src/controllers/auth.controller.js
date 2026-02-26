import { registerUserService, loginUserService } from "../services/auth.service.js";

export async function registerUserController(req, res, next){
    try {
        const {name, email, password} = req.body;
        if(!name||!email||!password){
            return res.status(400).json({message: "Name, email and password are required"})
        }
        const result = await registerUserService({name,email,password});
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
}

export async function loginUserController(req, res, next){
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Email and password are required."})
        }
        const result = await loginUserService({email,password});
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}