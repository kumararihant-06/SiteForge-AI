import { GeminiService } from "./gemini.service.js";

export function createAIProvider(provider = "gemini", model){
    switch (provider) {
        case "gemini":
            return new GeminiService(model)
        default: 
            throw new Error(`Unknown AI provider: ${provider}`)
    }
}