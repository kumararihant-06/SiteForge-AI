import { prisma } from "../prisma/client.js";
import { verifyToken } from "../utils/jwt.js";

export async function authenticate(req, res, next){
    try {
        const token  = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message:"Unauthorized User"});
    }
    const blacklisted = await prisma.verification.findFirst({
        where:{
            identifier:"blacklisted-token",
            value: token
        }
    })
    if(blacklisted){
        res.status(400).json({message:"Token has been invalidated. Please login again."})
    }
    const decoded = verifyToken(token);
    if(!decoded){
        res.status(401).json({message:"Unauthorized: Invalid or Expired Token."})
    }

    req.user = decoded;
    next();
    } catch (err) {
        next(err);
    }
}