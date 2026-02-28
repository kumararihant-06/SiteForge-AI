import { AiProvider } from "./ai.interface.js";

export class OpenRouterService extends AiProvider {
    constructor(model = "arcee-ai/trinity-large-preview:free" ){
        super();
        this.model = model;
        this.baseUrl = "https://openrouter.ai/api/v1/chat/completions";
    }

    async generate(messages) {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
                "X-Title": "SiteForge AI"
            },
            body: JSON.stringify({
                model: this.model,
                messages
            })
        });

        if(!response.ok){
            const err = await response.json();
            console.log("OpenRouter full error:", JSON.stringify(err, null, 2));
            throw new Error(`OpenRouter error: ${err.error?.message || "Unknown error"}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }
}