import { getcredits, getProfile } from "../services/user.service.js";

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