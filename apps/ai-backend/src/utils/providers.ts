import { Gemini } from "../llms/Gemini.js"
import { OpenAi } from "../llms/OpenAi.js"
import { Claude } from "../llms/Claude.js"
import { MistralAI } from "../llms/Mistral.js"
import { GroqAI } from "../llms/Groq.js"
import { Openrouter } from "../llms/Openrouter.js"
import { Messages } from "../types.js"
import { LlmResponse } from "../llms/Base.js"

export async function callProvider(
    providerName: string,
    model: string,
    messages: Messages,
): Promise<LlmResponse | null> {
    try {
        switch (providerName) {
            case "Google API":
                return await Gemini.chat(model, messages)

            case "OpenAI":
                return await OpenAi.chat(model, messages)

            case "Claude API":
                return await Claude.chat(model, messages)

            case "MistralAI":
                return await MistralAI.chat(model, messages)

            case "Groq":
                return await GroqAI.chat(model, messages)

            case "Openrouter":
                return await Openrouter.chat(model, messages)

            default:
                throw new Error(`Unsupported provider ${providerName}`)
        }
    } catch (error) {
        console.error(`${providerName} failed`, error)

        return null
    }
}
