import { deleteAccount, getcredits, getProfile, updateName, updatePassword } from "../services/user.service.js";

export async function getProfileController(req, res, next){
    try {
        const userId = req.user.userId;
        const response = await getProfile(userId);
        return res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export async function getCreditsController(req, res, next){
    try {
        const userId = req.user.userId;
        const response = await getcredits(userId);
        return res.status(200).json(response?.credits)
    } catch (error) {
        next(error);
    }

}

export async function updateNameController(req, res, next){
    try {
        const {newName} = req.body;
        if(!newName) return res.status(400).json({message: "New name is required to change the name. "})
        const result = await updateName({userId: req.user.userId,newName});
        res.status(200).json(result)
    } catch (error) {
        next(error);
    }
}

export async function updatePasswordController(req, res, next){
    try {
        const {currentPassword, newPassword} = req.body;
        if(!currentPassword || !newPassword) return res.status(400).json({message:"Current password and new password both are required to update the password."})
        const result = await updatePassword({userId:req.user.userId,currentPassword,newPassword});
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

export async function deleteAccountController(req, res, next){
    try {
        const result =  await deleteAccount(req.user.userId);
        req.status(200).json(result);
    } catch (error) {
        next(error);
    }
}