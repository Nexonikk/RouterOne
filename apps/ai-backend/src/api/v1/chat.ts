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
            const model = body.model
            const [_companyName, providerModelName] = model.split("/")
            const apiKeyDb = await prisma.apiKey.findFirst({
                where: {
                    apiKey,
                    disabled: false,
                    deleted: false,
                },
                select: {
                    user: true,
                },
            })

            if (!apiKeyDb) {
                return status(403, {
                    message: "Invalid api key",
                })
            }

            if (apiKeyDb?.user.credits <= 0) {
                return status(403, {
                    message: "You dont have enough credits in your db",
                })
            }

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

            const provider = providers[Math.floor(Math.random() * providers.length)]

            const response = await callWithFallback(
                provider.provider.name,
                providerModelName,
                body.messages,
            )

            if (!response) {
                return status(503, {
                    message: "All providers failed",
                })
            }

            const creditsUsed =
                (response.response.inputTokensConsumed * provider.inputTokenCost +
                    response.response.outputTokensConsumed * provider.outputTokenCost) /
                10

            const res = await prisma.user.update({
                where: {
                    id: apiKeyDb.user.id,
                },
                data: {
                    credits: {
                        decrement: creditsUsed,
                    },
                },
            })
            console.log(res)

            const res2 = await prisma.apiKey.update({
                where: {
                    apiKey: apiKey,
                },
                data: {
                    creditsConsumed: {
                        increment: creditsUsed,
                    },
                },
            })
            console.log(res2)

            return response
        },
        {
            body: Conversation,
        },
    )
