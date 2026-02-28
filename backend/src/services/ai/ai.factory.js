import { OpenRouterService } from "./openrouter.service.js";

export function createAIProvider(provider = "openrouter", model){
    switch (provider) {
        case "openrouter":
            return new OpenRouterService(model);
        default: 
            throw new Error(`Unknown AI provider: ${provider}`)
    }
}