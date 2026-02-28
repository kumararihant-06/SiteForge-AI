import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createProjectController, deleteProjectController, getPublishedProjectController, getPublishedProjectsController, getSingleProjectController, getUserProjectsController, makeRevisionController, rollbackToVersionController, saveProjectCodeController, togglePublishController } from "../controllers/project.controller.js";

const projectRouter = Router();

//public routes - no auth needed
projectRouter.get("/published", getPublishedProjectsController)
projectRouter.get("/published/:id", getPublishedProjectController)

//Auth middleware
projectRouter.use(authenticate);

//Protected routes
projectRouter.post("/create", createProjectController)
projectRouter.get("/all-projects", getUserProjectsController)
projectRouter.get("/all-projects/:id", getSingleProjectController)
projectRouter.delete("/all-projects/:id", deleteProjectController)
projectRouter.put("/save/:id", saveProjectCodeController)
projectRouter.get("/publish/:id", togglePublishController)
projectRouter.post("/revision/:id", makeRevisionController)
projectRouter.get("/rollback/:projectId/:versionId", rollbackToVersionController)

export default projectRouter;