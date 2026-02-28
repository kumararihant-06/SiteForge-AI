import { createProject, deleteProject, getSingleProject, getUserProjects, saveProjectCode, togglePublish } from "../services/project.service.js";

export async function createProjectController(req,res,next) {
    try {
        const {prompt, aiProvider = "openrouter", aiModel} = req.body;

        if(!prompt) return res.status(400).json({error: "Prompt is required."})

        const result = await createProject({
            userId: req.user.userId,
            prompt,
            aiProvider,
            aiModel
        });
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

export async function getUserProjectsController(req,res,next){
    try {
        const projects = await getUserProjects(req.user.userId)
        return res.status(200).json(projects)
    } catch (error) {
        next(error);
    }
}

export async function getSingleProjectController(req, res, next){
    try {
        const project = await getSingleProject(req.params.id,req.user.userId);
        return res.status(200).json(project);
    } catch (error) {
        next(error);
    }
}

export async function deleteProjectController(req, res, next){
    try {
        const result = await deleteProject(req.params.id,req.user.userId);
        return res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}

export async function saveProjectCodeController(req, res, next){
    try {
        const {code} = req.body
        if (!code) return res.status(400).json({error: "Code is required"})
        const result =  await saveProjectCode(req.params.id, req.user.userId,code);
        return res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

export async function togglePublishController(req, res, next){
    try {
        const result =  await togglePublish(req.params.id, req.user.userId);
        res.status(200).json(result);
    } catch (error) {
        next(error)
    }
}