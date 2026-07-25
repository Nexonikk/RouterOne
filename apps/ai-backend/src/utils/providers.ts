import { Gemini } from "../llms/Gemini"
import { OpenAi } from "../llms/OpenAi"
import { Claude } from "../llms/Claude"
import { MistralAI } from "../llms/Mistral"
import { GroqAI } from "../llms/Groq"
import { Openrouter } from "../llms/Openrouter"
import { Messages } from "../types"
import { LlmResponse } from "../llms/Base"

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
