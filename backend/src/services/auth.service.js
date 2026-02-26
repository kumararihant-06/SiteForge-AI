import {prisma} from "../prisma/client.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { v4 as uuidv4} from "uuid";
export async function registerUserService({name,email,password}){
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

    const token = generateToken({userId: user.id, email: user.email});
    return {token, user:{id: user.id,name: user.name, email: user.email}};
}

export async function loginUserService({email, password}){
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

export async function logout (){

}