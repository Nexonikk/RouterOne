import { Messages } from "../types.js"
import { BaseLlm, LlmResponse } from "./Base.js"
import Groq from "groq-sdk"

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY!,
})

export class GroqAI extends BaseLlm {
    static async chat(model: string, messages: Messages): Promise<LlmResponse> {
        const response = await groq.chat.completions.create({
            model,
            messages: messages.map((message) => ({
                role: message.role,
                content: message.content,
            })),
        })

        return {
            inputTokensConsumed: response.usage?.prompt_tokens ?? 0,
            outputTokensConsumed: response.usage?.completion_tokens ?? 0,
            completions: {
                choices: [
                    {
                        message: {
                            content: response.choices?.[0]?.message?.content ?? "",
                        },
                    },
                ],
            },
        }
    }
}
