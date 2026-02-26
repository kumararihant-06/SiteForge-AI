import { verifyToken } from "../utils/jwt.js";

export function authenticate(req, res, next){
    const token  = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if(!token){
        res.status(401).json({message:"Unauthorized User"});
    }
    const decoded = verifyToken(token);
    if(!decoded){
        res.status(401).json({message:"Unauthorized: Invalid or Expired Token."})
    }

    req.user = decoded;
    next();
}