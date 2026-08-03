import { Messages } from "../types.js"
import { BaseLlm, LlmResponse } from "./Base.js"
import { Mistral } from "@mistralai/mistralai"

const apiKey = process.env.MISTRAL_API_KEY || "your_api_key"

const client = new Mistral({ apiKey: apiKey })

export class MistralAI extends BaseLlm {
    static async chat(model: string, messages: Messages): Promise<LlmResponse> {
        const response = await client.chat.complete({
            model: model,
            messages: messages.map((message) => ({
                role: message.role,
                content: message.content,
            })),
        })

        return {
            inputTokensConsumed: response.usage.promptTokens!,
            outputTokensConsumed: response.usage.completionTokens!,
            completions: {
                choices: [
                    {
                        message: {
                            content: response.choices[0].message?.content as string,
                        },
                    },
                ],
            },
        }
    }
}
