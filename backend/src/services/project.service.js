import { prisma } from "../prisma/client.js";
import { createAIProvider } from "./ai/ai.factory.js";
import {
  ENHANCE_PROMPT_SYSTEM,
  GENERATE_WEBSITE_SYSTEM,
  ENHANCE_REVISION_SYSTEM,
  REVISION_SYSTEM,
} from "./ai/prompts.js";
import { v4 as uuidv4 } from "uuid";

const CREATION_COST = 5;
const REVISION_COST = 1;

export async function createProject({ userId, prompt, aiProvider, aiModel }) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  //1. check if user has enough credits or not
  if (user.credits < CREATION_COST) {
    const error = new Error("Not enough credits. Please purchase more.");
    error.status = 400;
    throw error;
  }
  //2. create ai provider instance
  const ai = createAIProvider(aiProvider, aiModel);
  //3. Enhance the user's prompt
  const enhancedPrompt = await ai.generate([
    { role: "system", content: ENHANCE_PROMPT_SYSTEM },
    { role: "user", content: prompt },
  ]);
  //4. generate the full HTML website
  const generatedCode = await ai.generate([
    { role: "system", content: GENERATE_WEBSITE_SYSTEM },
    { role: "user", content: enhancedPrompt },
  ]);
  //5. create the project in database
  const project = await prisma.websiteProject.create({
    data: {
      id: uuidv4(),
      name: prompt.slice(0, 100) + "...",
      initial_prompt: prompt,
      current_code: generatedCode,
      userId,
      aiModel: aiProvider,
    },
  });
  //6. create the first version snapshot
  const version = await prisma.version.create({
    data: {
      id: uuidv4(),
      code: generatedCode,
      description: "Initial generation",
      aiModel: aiProvider,
      projectId: project.id,
    },
  });
  //7. set the current version on the project
  await prisma.websiteProject.update({
    where: { id: project.id },
    data: { currentVersionId: version.id },
  });
  //8. save the conversation history
  await prisma.conversation.createMany({
    data: [
      {
        id: uuidv4(),
        role: "user",
        content: prompt,
        projectId: project.id,
      },
      {
        id: uuidv4(),
        role: "assistant",
        content: "I've generated your website based on your prompt!",
        projectId: project.id,
      },
    ],
  });
  //9. deduct the credits and increment the total creation
  await prisma.user.update({
    where: { id: userId },
    data: {
      credits: { decrement: CREATION_COST },
      totalCreation: { increment: 1 },
    },
  });

  return {
    project: {
      ...project,
      currentVersionId: version.id,
    },
    code: generatedCode,
  };
}

export async function getUserProjects(userId) {
  return prisma.websiteProject.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      initial_prompt: true,
      isPublished: true,
      aiModel: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function getSingleProject(projectId, userId) {
  const project = await prisma.websiteProject.findFirst({
    where: { id: projectId, userId },
    include: {
      conversation: { orderBy: { timestamp: "asc" } },
      versions: { orderBy: { timeStamp: "desc" } },
    },
  });

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }
  return project;
}

export async function deleteProject(projectId, userId) {
  const project = await prisma.websiteProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    const error = new Error("Project not found.");
    error.status = 404;
    throw error;
  }

  await prisma.websiteProject.delete({
    where: { id: projectId },
  });

  return { message: "Project deleted successfully." };
}

export async function saveProjectCode(projectId, userId, code) {
  const project = await prisma.websiteProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    const error = new Error("Project not found.");
    error.status = 404;
    throw error;
  }
  // create a new version snapshot
  const version = await prisma.version.create({
    data: {
      id: uuidv4(),
      code,
      description: "Mannual save",
      projectId,
    },
  });

  //update the project with new code and current version.
  await prisma.websiteProject.update({
    where: { id: projectId },
    data: {
      current_code: code,
      currentVersionId: version.id,
    },
  });

  return { message: "Project saved successfully", versionId: version.id };
}

export async function togglePublish(projectId, userId) {
  const project = await prisma.websiteProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    const error = new Error("Project not found.");
    error.status = 404;
    throw error;
  }

  const updated = await prisma.websiteProject.update({
    where: { id: projectId },
    data: { isPublished: !project.isPublished },
  });

  return {
    message: updated.isPublished ? "Project published" : "Project Unpublished",
    isPublished: updated.isPublished,
  };
}

export async function makeRevision({ projectId, userId, prompt }) {
  //check user credits.
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (user.credits < REVISION_COST) {
    const error = new Error("Not Enough credits. please purchase more.");
    error.status = 400;
    throw error;
  }
  //get the project and its current code.
  const project = await prisma.websiteProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  //create AI provider
  const ai = createAIProvider(project.aiModel);

  // enhanve the revision prompt
  const enhancedPrompt = await ai.generate([
    { role: "system", content: ENHANCE_REVISION_SYSTEM },
    { role: "user", content: prompt },
  ]);

  //generate current code based on current code + prompt
  const updatedCode = await ai.generate([
        { role: "system", content: REVISION_SYSTEM },
        {
            role: "user",
            content: `You are given the COMPLETE source code of an existing website below. Your job is to make ONLY the requested changes to this existing code and return the FULL updated HTML. Do NOT generate a new website from scratch. Modify the existing code only.
            EXISTING WEBSITE CODE:${project.current_code}
            REQUESTED CHANGES:${enhancedPrompt}

            Return the complete updated HTML file with the changes applied. Do not explain anything, just return the full HTML.`,
        },
  ]);

  //create new version snapshot
  const version = await prisma.version.create({
    data: {
      id: uuidv4(),
      code: updatedCode,
      description: prompt.slice(0, 100) + "...",
      aiModel: project.aiModel,
      projectId,
    },
  });

  //update project with new code and current version
  await prisma.websiteProject.update({
    where: { id: projectId },
    data: {
      current_code: updatedCode,
      currentVersionId: version.id,
    },
  });

  //save conversation history
  await prisma.conversation.createMany({
    data: [
      {
        id: uuidv4(),
        role: "user",
        content: prompt,
        projectId,
      },
      {
        id: uuidv4(),
        role: "assistant",
        content: "I have updated your website based on your request",
        projectId,
      },
    ],
  });

  //deduct credits
  await prisma.user.update({
    where: { id: userId },
    data: { credits: { decrement: REVISION_COST } },
  });

  return { code: updatedCode, versionId: version.id };
}

export async function rollbackToVersion({ projectId, userId, versionId }) {
  //make sure project belongs to the user
  const project = await prisma.websiteProject.findFirst({
    where: { id: projectId, userId },
  });

  if (!project) {
    const error = new Error("Project not found");
    error.status = 404;
    throw error;
  }

  const version = await prisma.version.findFirst({
    where: { id: versionId, projectId },
  });

  if (!version) {
    const error = new Error("Version not found.");
    error.status = 404;
    throw error;
  }

  //update project with version's code
  await prisma.websiteProject.update({
    where: { id: projectId },
    data: {
      current_code: version.code,
      currentVersionId: version.id,
    },
  });

  return { message: "Rolled back successfully.", code: version.code };
}

export async function getPublishedProjects() {
  return prisma.websiteProject.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      initial_prompt: true,
      current_code: true,
      aiModel: true,
      createdAt: true,
      user: {
        select: { name: true },
      },
    },
  });
}

export async function getPublishedProject(projectId) {
  const project = await prisma.websiteProject.findFirst({
    where: {
      id: projectId,
      isPublished: true,
    },
    select: {
      id: true,
      name: true,
      initial_prompt: true,
      current_code: true,
      aiModel: true,
      createdAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!project) {
    const error = new Error("Project not found or not published.");
    error.status = 404;
    throw error;
  }

  return project;
}
