import { callProvider } from "./providers.js"
import { Messages } from "../types.js"
import { LlmResponse } from "../llms/Base.js"

export type ProviderAttempt = {
    providerName: string
    modelSlug: string
    providerModel: string
    status: "success" | "failed"
    latencyMs: number
    response: LlmResponse | null
    error?: string
}

const FALLBACK_PROVIDER = "MistralAI"

// RouterOne slug
const FALLBACK_MODEL_SLUG = "mistral/mistral-small-latest"

// Actual model name sent to Mistral API
const FALLBACK_PROVIDER_MODEL = "mistral-small-latest"

export async function callWithFallback(
    primaryProvider: string,
    primaryModelSlug: string,
    primaryProviderModel: string,
    messages: Messages,
): Promise<{
    response: LlmResponse
    attempts: ProviderAttempt[]
} | null> {
    const attempts: ProviderAttempt[] = []

    // -----------------------------
    // Primary provider
    // -----------------------------

    const primaryStartedAt = Date.now()

    const primaryResponse = await callProvider(primaryProvider, primaryProviderModel, messages)

    const primaryLatencyMs = Date.now() - primaryStartedAt

    if (primaryResponse && primaryResponse.completions?.choices?.[0]?.message?.content) {
        attempts.push({
            providerName: primaryProvider,
            modelSlug: primaryModelSlug,
            providerModel: primaryProviderModel,
            status: "success",
            latencyMs: primaryLatencyMs,
            response: primaryResponse,
        })

        return {
            response: primaryResponse,
            attempts,
        }
    }

    attempts.push({
        providerName: primaryProvider,
        modelSlug: primaryModelSlug,
        providerModel: primaryProviderModel,
        status: "failed",
        latencyMs: primaryLatencyMs,
        response: primaryResponse,
        error: "Primary provider failed",
    })

    console.log(`${primaryProvider} failed. Switching to fallback`)

    // -----------------------------
    // Fallback provider
    // -----------------------------

    const fallbackStartedAt = Date.now()

    const fallbackResponse = await callProvider(
        FALLBACK_PROVIDER,
        FALLBACK_PROVIDER_MODEL,
        messages,
    )

    const fallbackLatencyMs = Date.now() - fallbackStartedAt

    if (fallbackResponse && fallbackResponse.completions?.choices?.[0]?.message?.content) {
        attempts.push({
            providerName: FALLBACK_PROVIDER,
            modelSlug: FALLBACK_MODEL_SLUG,
            providerModel: FALLBACK_PROVIDER_MODEL,
            status: "success",
            latencyMs: fallbackLatencyMs,
            response: fallbackResponse,
        })

        return {
            response: fallbackResponse,
            attempts,
        }
    }

    attempts.push({
        providerName: FALLBACK_PROVIDER,
        modelSlug: FALLBACK_MODEL_SLUG,
        providerModel: FALLBACK_PROVIDER_MODEL,
        status: "failed",
        latencyMs: fallbackLatencyMs,
        response: fallbackResponse,
        error: "Fallback provider failed",
    })

    return null
}
