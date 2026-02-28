import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProjectController, deleteProjectController, getSingleProjectController, getUserProjectsController, saveProjectCodeController, togglePublishController } from "../controllers/project.controller.js";

const projectRouter = Router();

projectRouter.use(authenticate);
projectRouter.post("/create", createProjectController)
projectRouter.get("/all-projects", getUserProjectsController)
projectRouter.get("/all-projects/:id", getSingleProjectController)
projectRouter.delete("/all-projects/:id", deleteProjectController)
projectRouter.put("/save/:id", saveProjectCodeController)
projectRouter.get("/publish/:id", togglePublishController)


export default projectRouter;