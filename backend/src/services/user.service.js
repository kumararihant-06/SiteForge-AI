import { sendVerificationEmail } from "../utils/email.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import {v4 as uuidv4} from "uuid"
export async function getProfile(userId){
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select:{
            id: true,
            name: true,
            email: true,
            credits: true,
            totalCreation: true,
            emailVerified: true,
            createdAt: true
        }
    });

    if(!user){
        const error = new Error("User not found")
        error.status= 404;
        throw error;
    }

    return user;
}

export async function getcredits(userId){
    const user = await prisma.user.findUnique({
        where: {id: userId},
        select:{
            credits: true
        }
    });
    if(!user){
        const error = new Error("User not found");
        error.status= 404;
        throw error;
    }

    return user;
}

export async function updateName({userId ,newName}){
    if(!newName || newName.trim().length === 0){
        const error = new Error("Name cannot be empty");
        error.status = 400;
        throw error;
    }

    const user = await prisma.user.update({
        where: {id: userId},
        data: {
            name: newName.trim()
        },
        select: {
            id: true,
            name: true,
            email: true,
            credits: true
        }
    });

    return { message: "Name updated successfully", user}
}

export async function updatePassword({userId, currentPassword, newPassword}){
    const user = await prisma.user.findUnique({
        where: {id:userId}
    });

    const isMatch = await comparePassword(currentPassword,user.password);
    if(!isMatch){
        const error = new Error("Incorrect current password.");
        error.status = 400;
        throw error;
    }
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: {id:userId},
        data: { password: hashedPassword}
    });

    return {message: "Password updated successfully"}
}

export async function deleteAccount(userId){
    await prisma.user.delete({
        where: {id: userId}
    });

    return { message: "Account deleted successfully."}
}