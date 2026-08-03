import { Messages } from "../types.js"
import { BaseLlm, LlmResponse } from "./Base.js"
import OpenAI from "openai"

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
})

export class OpenAi extends BaseLlm {
    static async chat(model: string, messages: Messages): Promise<LlmResponse> {
        const response = await client.responses.create({
            model: model,
            input: messages.map((message) => ({
                role: message.role,
                content: message.content,
            })),
        })

        return {
            inputTokensConsumed: response.usage?.input_tokens!,
            outputTokensConsumed: response.usage?.output_tokens!,
            completions: {
                choices: [
                    {
                        message: {
                            content: response.output_text,
                        },
                    },
                ],
            },
        }
    }
}
