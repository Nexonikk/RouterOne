import { Elysia } from "elysia"
import { bearer } from "@elysiajs/bearer"
import { prisma } from "db"
import { Conversation } from "../../types.js"
import { callWithFallback } from "../../utils/fallback.js"

export const chatRoutes = new Elysia({ prefix: "/chat" })
    .use(bearer())

    .post(
        "/completions",
        async ({ status, bearer: apiKey, body }) => {
            const requestStartedAt = Date.now()

            const model = body.model
            const [_companyName, providerModelName] = model.split("/")

            // 1. Authenticate API key

            const apiKeyDb = await prisma.apiKey.findFirst({
                where: {
                    apiKey,
                    disabled: false,
                    deleted: false,
                },
                select: {
                    id: true,
                    user: true,
                },
            })

            if (!apiKeyDb) {
                return status(403, {
                    message: "Invalid api key",
                })
            }

            if (apiKeyDb.user.credits <= 0) {
                return status(403, {
                    message: "You dont have enough credits in your db",
                })
            }

            // 2. Find requested model

            const modelDb = await prisma.model.findFirst({
                where: {
                    slug: model,
                },
            })

            if (!modelDb) {
                return status(403, {
                    message: "This is an invalid model we dont support",
                })
            }

            // 3. Find provider mappings

            const providers = await prisma.modelProviderMapping.findMany({
                where: {
                    modelId: modelDb.id,
                },
                include: {
                    provider: true,
                },
            })

            if (providers.length === 0) {
                return status(400, {
                    message: "No provider configured for this model",
                })
            }

            // 4. Pick primary provider

            const provider = providers[Math.floor(Math.random() * providers.length)]

            // 5. Create Usage record

            const requestId = crypto.randomUUID()

            const usage = await prisma.usage.create({
                data: {
                    requestId,

                    userId: apiKeyDb.user.id,
                    apiKeyId: apiKeyDb.id,

                    modelProviderMappingId: provider.id,

                    status: "pending",
                    streaming: false,
                },
            })

            // 6. Call provider + fallback

            const result = await callWithFallback(
                provider.provider.name,
                model,
                providerModelName,
                body.messages,
            )

            // 7. All providers failed

            if (!result) {
                const latencyMs = Date.now() - requestStartedAt

                await prisma.usage.update({
                    where: {
                        id: usage.id,
                    },
                    data: {
                        status: "failed",
                        latencyMs,
                    },
                })

                return status(503, {
                    message: "All providers failed",
                    requestId,
                })
            }

            // 8. Final successful response

            const response = result.response

            const inputTokens = response.inputTokensConsumed
            const outputTokens = response.outputTokensConsumed
            const totalTokens = inputTokens + outputTokens

            // 9. Find the ACTUAL successful mapping

            const successfulAttempt = [...result.attempts]
                .reverse()
                .find((attempt) => attempt.status === "success")

            if (!successfulAttempt) {
                await prisma.usage.update({
                    where: {
                        id: usage.id,
                    },
                    data: {
                        status: "failed",
                        latencyMs: Date.now() - requestStartedAt,
                    },
                })

                return status(503, {
                    message: "No successful provider attempt",
                    requestId,
                })
            }

            // 10. Find DB mapping of successful provider/model

            const successfulMapping = await prisma.modelProviderMapping.findFirst({
                where: {
                    model: {
                        slug: successfulAttempt.modelSlug,
                    },
                    provider: {
                        name: successfulAttempt.providerName,
                    },
                },
            })

            if (!successfulMapping) {
                await prisma.usage.update({
                    where: {
                        id: usage.id,
                    },
                    data: {
                        status: "failed",
                        latencyMs: Date.now() - requestStartedAt,
                    },
                })

                return status(500, {
                    message: "Successful provider mapping not found",
                    requestId,
                })
            }

            // 11. Calculate credits

            const rawCreditsUsed =
                (inputTokens * successfulMapping.inputTokenCost +
                    outputTokens * successfulMapping.outputTokenCost) /
                10

            // Since your schema uses Int for credits:
            const creditsUsed = Math.ceil(rawCreditsUsed)

            const latencyMs = Date.now() - requestStartedAt

            // --------------------------------------------------
            // 12. Save everything atomically
            // --------------------------------------------------

            await prisma.$transaction(async (tx) => {
                // Update Usage
                await tx.usage.update({
                    where: {
                        id: usage.id,
                    },
                    data: {
                        inputTokenCount: inputTokens,
                        outputTokenCount: outputTokens,
                        totalTokenCount: totalTokens,

                        creditsConsumed: creditsUsed,

                        status: "success",
                        latencyMs,
                    },
                })

                // Save provider attempts
                for (let i = 0; i < result.attempts.length; i++) {
                    const attempt = result.attempts[i]

                    const attemptMapping = await tx.modelProviderMapping.findFirst({
                        where: {
                            model: {
                                slug: attempt.modelSlug,
                            },
                            provider: {
                                name: attempt.providerName,
                            },
                        },
                    })

                    if (!attemptMapping) {
                        continue
                    }

                    await tx.usageAttempt.create({
                        data: {
                            usageId: usage.id,

                            modelProviderMappingId: attemptMapping.id,

                            attemptNumber: i + 1,

                            status: attempt.status,

                            latencyMs: attempt.latencyMs,

                            error: attempt.error ?? null,

                            inputTokenCount: attempt.response?.inputTokensConsumed ?? null,

                            outputTokenCount: attempt.response?.outputTokensConsumed ?? null,
                        },
                    })
                }

                // Save prompt/response
                await tx.conversation.create({
                    data: {
                        usageId: usage.id,

                        userId: apiKeyDb.user.id,
                        apiKeyId: apiKeyDb.id,

                        modelProviderMappingId: provider.id,

                        input: JSON.stringify(body.messages),

                        output: response.completions?.choices?.[0]?.message?.content ?? "",

                        inputTokenCount: inputTokens,
                        outputTokenCount: outputTokens,
                    },
                })

                // Deduct user credits
                await tx.user.update({
                    where: {
                        id: apiKeyDb.user.id,
                    },
                    data: {
                        credits: {
                            decrement: creditsUsed,
                        },
                    },
                })

                // Update API key usage counter
                await tx.apiKey.update({
                    where: {
                        id: apiKeyDb.id,
                    },
                    data: {
                        creditsConsumed: {
                            increment: creditsUsed,
                        },
                        lastUsed: new Date(),
                    },
                })
            })

            // 13. Return OpenAI-compatible response

            return response
        },
        {
            body: Conversation,
        },
    )
