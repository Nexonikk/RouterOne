import { callProvider } from "./providers.js"
import { Messages } from "../types.js"
import { LlmResponse } from "../llms/Base.js"

const FALLBACK_PROVIDER = "MistralAI"
const FALLBACK_MODEL = "mistral/mistral-small-latest"

export async function callWithFallback(
    primaryProvider: string,
    primaryModel: string,
    messages: Messages,
): Promise<{
    response: LlmResponse
} | null> {
    const primaryResponse = await callProvider(primaryProvider, primaryModel, messages)

    if (primaryResponse && primaryResponse.completions?.choices?.[0]?.message?.content) {
        return {
            response: primaryResponse,
        }
    }

    console.log(`${primaryProvider} failed. Switching to fallback`)

    const fallbackResponse = await callProvider(FALLBACK_PROVIDER, FALLBACK_MODEL, messages)

    if (fallbackResponse && fallbackResponse.completions?.choices?.[0]?.message?.content) {
        return {
            response: fallbackResponse,
        }
    }

    return null
}
