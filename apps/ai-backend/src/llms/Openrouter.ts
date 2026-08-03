import { Messages } from "../types.js"
import { BaseLlm, LlmResponse } from "./Base.js"
import { OpenRouter } from "@openrouter/sdk"

const client = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY!,
})

export class Openrouter extends BaseLlm {
    static async chat(model: string, messages: Messages): Promise<LlmResponse> {
        const response = await client.chat.send({
            chatRequest: {
                model,
                stream: false,
                messages: messages.map((message: any) => ({
                    role: message.role,
                    content: message.content,
                })),
            },
        })

        if (!("choices" in response)) {
            throw new Error("Expected non-streaming response")
        }

        const content = response.choices[0]?.message?.content

        return {
            inputTokensConsumed: response.usage?.promptTokens ?? 0,
            outputTokensConsumed: response.usage?.completionTokens ?? 0,
            completions: {
                choices: [
                    {
                        message: {
                            content: typeof content === "string" ? content : "",
                        },
                    },
                ],
            },
        }
    }
}
