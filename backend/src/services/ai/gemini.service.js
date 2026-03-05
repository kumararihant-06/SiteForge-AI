import { GoogleGenerativeAI } from "@google/generative-ai";
import { AiProvider } from "./ai.interface.js"

export class GeminiService extends AiProvider {
    constructor( model = "gemini-2.5-flash"){
        super();
        this.model = model;
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    }

    async generate(messages) {
  const model = this.genAI.getGenerativeModel({ 
    model: this.model,
    systemInstruction: messages.find((m) => m.role === "system")?.content || "",
  });

  const userMessages = messages.filter((m) => m.role !== "system");

  if (userMessages.length === 0) {
    throw new Error("No user messages provided");
  }

  const history = userMessages.slice(0, -1).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const lastMessage = userMessages[userMessages.length - 1];

  const chat = model.startChat({ history });

  const result = await chat.sendMessage(lastMessage.content);
  return result.response.text();
}
}