import { t } from "elysia"

export namespace UsageModel {
    export const rangeQuery = t.Object({
        range: t.Optional(
            t.Union([t.Literal("24h"), t.Literal("7d"), t.Literal("30d"), t.Literal("90d")]),
        ),
    })

    export type rangeQuery = typeof rangeQuery.static

    export const summaryResponse = t.Object({
        requests: t.Number(),
        successfulRequests: t.Number(),
        failedRequests: t.Number(),

        inputTokens: t.Number(),
        outputTokens: t.Number(),
        totalTokens: t.Number(),

        creditsUsed: t.Number(),

        averageLatencyMs: t.Number(),
    })

    export type summaryResponse = typeof summaryResponse.static

    export const timeseriesResponse = t.Array(
        t.Object({
            date: t.String(),
            requests: t.Number(),
            inputTokens: t.Number(),
            outputTokens: t.Number(),
            totalTokens: t.Number(),
            creditsUsed: t.Number(),
        }),
    )

    export type timeseriesResponse = typeof timeseriesResponse.static

    export const modelsResponse = t.Array(
        t.Object({
            modelId: t.Number(),
            model: t.String(),
            requests: t.Number(),
            inputTokens: t.Number(),
            outputTokens: t.Number(),
            totalTokens: t.Number(),
            creditsUsed: t.Number(),
        }),
    )

    export type modelsResponse = typeof modelsResponse.static

    export const providersResponse = t.Array(
        t.Object({
            providerId: t.Number(),
            provider: t.String(),
            requests: t.Number(),
            creditsUsed: t.Number(),
            averageLatencyMs: t.Number(),
        }),
    )

    export type providersResponse = typeof providersResponse.static

    export const apiKeysResponse = t.Array(
        t.Object({
            apiKeyId: t.Number(),
            name: t.String(),
            requests: t.Number(),
            inputTokens: t.Number(),
            outputTokens: t.Number(),
            totalTokens: t.Number(),
            creditsUsed: t.Number(),
        }),
    )

    export type apiKeysResponse = typeof apiKeysResponse.static

    export const requestsQuery = t.Object({
        range: t.Optional(
            t.Union([t.Literal("24h"), t.Literal("7d"), t.Literal("30d"), t.Literal("90d")]),
        ),
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
    })

    export type requestsQuery = typeof requestsQuery.static

    export const requestsResponse = t.Object({
        requests: t.Array(
            t.Object({
                requestId: t.String(),

                model: t.String(),
                provider: t.String(),
                apiKeyName: t.String(),

                inputTokens: t.Number(),
                outputTokens: t.Number(),
                totalTokens: t.Number(),

                creditsUsed: t.Number(),

                status: t.String(),
                latencyMs: t.Nullable(t.Number()),
                streaming: t.Boolean(),

                createdAt: t.Date(),
            }),
        ),

        page: t.Number(),
        limit: t.Number(),
        total: t.Number(),
        totalPages: t.Number(),
    })

    export type requestsResponse = typeof requestsResponse.static

    export const requestDetailResponse = t.Object({
        requestId: t.String(),

        model: t.String(),
        provider: t.String(),
        apiKeyName: t.String(),

        inputTokens: t.Number(),
        outputTokens: t.Number(),
        totalTokens: t.Number(),

        creditsUsed: t.Number(),

        status: t.String(),
        latencyMs: t.Nullable(t.Number()),
        streaming: t.Boolean(),

        createdAt: t.Date(),

        conversation: t.Nullable(
            t.Object({
                input: t.String(),
                output: t.String(),
                createdAt: t.Date(),
            }),
        ),

        attempts: t.Array(
            t.Object({
                attemptNumber: t.Number(),
                provider: t.String(),
                model: t.String(),
                status: t.String(),
                latencyMs: t.Nullable(t.Number()),
                error: t.Nullable(t.String()),
                inputTokens: t.Nullable(t.Number()),
                outputTokens: t.Nullable(t.Number()),
                createdAt: t.Date(),
            }),
        ),
    })

    export type requestDetailResponse = typeof requestDetailResponse.static
}
