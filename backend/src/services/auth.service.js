import {prisma} from "../prisma/client.js";
import { sendVerificationEmail } from "../utils/email.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { v4 as uuidv4} from "uuid";

export async function registerService({name,email,password}){
    const existingUser = await prisma.user.findUnique({where:{email}});
    if(existingUser){
        const error = new Error("User with this email already exists.");
        error.status = 400
        throw error;
    }
    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
        data:{
            id: uuidv4(),
            name,
            email,
            password: hashedPassword
        }
    });

    const verificationToken = uuidv4();
    await prisma.verification.create({
        data:{
            id: uuidv4(),
            identifier: email,
            value: verificationToken,
            expiresAt: new Date(Date.now()+24*60*60*1000)
        }
    })

    await sendVerificationEmail(email, verificationToken);

    const token = generateToken({userId: user.id, email: user.email});
    return {token, user:{id: user.id,name: user.name, email: user.email}};
}

export async function loginService({email, password}){
    const user = await prisma.user.findUnique({where:{email}});
    if(!user){
        const error = new Error("Invalid email or password.")
        error.status = 401
        throw error; 
    }

    if(!user.password){
        const error = new Error("This account uses google login. Please sign in with Google.")
        error.status = 401;
        throw error
    }

    const isMatch = await comparePassword(password, user.password);
    if(!isMatch){
        const error = new Error("Invalid email or password.");
        error.status = 401;
        throw error
    }

    const token =  generateToken({userId: user.id, email: user.email})
    return {token,user:{id: user.id, name: user.name, email: user.email}}
}

export async function verifyEmailService (token){
    const verification = await prisma.verification.findFirst({
        where:{
            value: token
        }
    })

    if(!verification){
        const error = new Error("Invalid verification token.")
        error.status = 400;
        throw error;
    }

    if(verification.expiresAt < new Date()){
        const error = new Error("Verificcation token has expired.")
        error.status = 400;
        throw error;
    }

    await prisma.user.update({
        where:{email: verification.identifier},
        data:{emailVerified: true}
    })

    await prisma.verification.delete({
        where:{id: verification.id}
    })

    return {message: "Email verified successfully."}
}

export async function logoutService(token){
    const decoded = verifyToken(token);

    if(!decoded){
        const error = new Error("Invalid token.");
        error.status= 401;
        throw error
    }

    await prisma.verification.deleteMany({
        where:{
            identifier:"blacklisted-token",
            expiresAt: {lt : new Date()}
        }
    })

    await prisma.verification.create({
        data:{
            id: uuidv4(),
            identifier:"blacklisted-token",
            value: token,
            expiresAt: new Date(decoded.exp*1000)
        }
    })

    return {message: "Logged out successfully."}
 
}