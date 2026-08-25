import { prisma } from "db"

export abstract class UsageService {
    private static getStartDate(range?: string) {
        const now = new Date()

        switch (range) {
            case "24h":
                return new Date(now.getTime() - 24 * 60 * 60 * 1000)

            case "7d":
                return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

            case "90d":
                return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)

            case "30d":
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

            default:
                return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
    }

    static async getSummary(userId: number, range?: string) {
        const startDate = this.getStartDate(range)

        const result = await prisma.usage.aggregate({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
            },

            _count: {
                _all: true,
            },

            _sum: {
                inputTokenCount: true,
                outputTokenCount: true,
                totalTokenCount: true,
                creditsConsumed: true,
            },

            _avg: {
                latencyMs: true,
            },
        })

        const successfulRequests = await prisma.usage.count({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
                status: "success",
            },
        })

        const failedRequests = await prisma.usage.count({
            where: {
                userId,
                createdAt: {
                    gte: startDate,
                },
                status: "failed",
            },
        })

        return {
            requests: result._count._all,

            successfulRequests,
            failedRequests,

            inputTokens: result._sum.inputTokenCount ?? 0,
            outputTokens: result._sum.outputTokenCount ?? 0,
            totalTokens: result._sum.totalTokenCount ?? 0,

            creditsUsed: result._sum.creditsConsumed ?? 0,

            averageLatencyMs: Math.round(result._avg.latencyMs ?? 0),
        }
    }

    static async getTimeseries(userId: number, range?: string) {
        const startDate = this.getStartDate(range)

        const rows = await prisma.$queryRaw<
            {
                date: Date
                requests: bigint
                inputTokens: bigint | null
                outputTokens: bigint | null
                totalTokens: bigint | null
                creditsUsed: bigint | null
            }[]
        >`
            SELECT
                DATE_TRUNC('day', "createdAt") AS date,
                COUNT(*) AS requests,
                COALESCE(SUM("inputTokenCount"), 0) AS "inputTokens",
                COALESCE(SUM("outputTokenCount"), 0) AS "outputTokens",
                COALESCE(SUM("totalTokenCount"), 0) AS "totalTokens",
                COALESCE(SUM("creditsConsumed"), 0) AS "creditsUsed"
            FROM "Usage"
            WHERE "userId" = ${userId}
              AND "createdAt" >= ${startDate}
            GROUP BY DATE_TRUNC('day', "createdAt")
            ORDER BY date ASC
        `

        return rows.map((row) => ({
            date: row.date.toISOString().slice(0, 10),

            requests: Number(row.requests),
            inputTokens: Number(row.inputTokens ?? 0),
            outputTokens: Number(row.outputTokens ?? 0),
            totalTokens: Number(row.totalTokens ?? 0),
            creditsUsed: Number(row.creditsUsed ?? 0),
        }))
    }

    static async getModels(userId: number, range?: string) {
        const startDate = this.getStartDate(range)

        const rows = await prisma.$queryRaw<
            {
                modelId: number
                model: string
                requests: bigint
                inputTokens: bigint | null
                outputTokens: bigint | null
                totalTokens: bigint | null
                creditsUsed: bigint | null
            }[]
        >`
            SELECT
                m."id" AS "modelId",
                m."name" AS model,

                COUNT(u."id") AS requests,

                COALESCE(SUM(u."inputTokenCount"), 0)
                    AS "inputTokens",

                COALESCE(SUM(u."outputTokenCount"), 0)
                    AS "outputTokens",

                COALESCE(SUM(u."totalTokenCount"), 0)
                    AS "totalTokens",

                COALESCE(SUM(u."creditsConsumed"), 0)
                    AS "creditsUsed"

            FROM "Usage" u

            INNER JOIN "ModelProviderMapping" mpm
                ON u."modelProviderMappingId" = mpm."id"

            INNER JOIN "Model" m
                ON mpm."modelId" = m."id"

            WHERE u."userId" = ${userId}
              AND u."createdAt" >= ${startDate}

            GROUP BY m."id", m."name"

            ORDER BY requests DESC
        `

        return rows.map((row) => ({
            modelId: Number(row.modelId),
            model: row.model,

            requests: Number(row.requests),
            inputTokens: Number(row.inputTokens ?? 0),
            outputTokens: Number(row.outputTokens ?? 0),
            totalTokens: Number(row.totalTokens ?? 0),
            creditsUsed: Number(row.creditsUsed ?? 0),
        }))
    }

    static async getProviders(userId: number, range?: string) {
        const startDate = this.getStartDate(range)

        const rows = await prisma.$queryRaw<
            {
                providerId: number
                provider: string
                requests: bigint
                creditsUsed: bigint | null
                averageLatencyMs: number | null
            }[]
        >`
            SELECT
                p."id" AS "providerId",
                p."name" AS provider,

                COUNT(DISTINCT u."id") AS requests,

                COALESCE(
                    SUM(u."creditsConsumed"),
                    0
                ) AS "creditsUsed",

                AVG(ua."latencyMs") AS "averageLatencyMs"

            FROM "UsageAttempt" ua

            INNER JOIN "Usage" u
                ON ua."usageId" = u."id"

            INNER JOIN "ModelProviderMapping" mpm
                ON ua."modelProviderMappingId" = mpm."id"

            INNER JOIN "Provider" p
                ON mpm."providerId" = p."id"

            WHERE u."userId" = ${userId}
              AND u."createdAt" >= ${startDate}
              AND ua."status" = 'success'

            GROUP BY p."id", p."name"

            ORDER BY requests DESC
        `

        return rows.map((row) => ({
            providerId: Number(row.providerId),
            provider: row.provider,

            requests: Number(row.requests),
            creditsUsed: Number(row.creditsUsed ?? 0),

            averageLatencyMs: Math.round(Number(row.averageLatencyMs ?? 0)),
        }))
    }

    static async getApiKeys(userId: number, range?: string) {
        const startDate = this.getStartDate(range)

        const rows = await prisma.$queryRaw<
            {
                apiKeyId: number
                name: string
                requests: bigint
                inputTokens: bigint | null
                outputTokens: bigint | null
                totalTokens: bigint | null
                creditsUsed: bigint | null
            }[]
        >`
            SELECT
                ak."id" AS "apiKeyId",
                ak."name" AS name,

                COUNT(u."id") AS requests,

                COALESCE(SUM(u."inputTokenCount"), 0)
                    AS "inputTokens",

                COALESCE(SUM(u."outputTokenCount"), 0)
                    AS "outputTokens",

                COALESCE(SUM(u."totalTokenCount"), 0)
                    AS "totalTokens",

                COALESCE(SUM(u."creditsConsumed"), 0)
                    AS "creditsUsed"

            FROM "Usage" u

            INNER JOIN "ApiKey" ak
                ON u."apiKeyId" = ak."id"

            WHERE u."userId" = ${userId}
              AND u."createdAt" >= ${startDate}

            GROUP BY ak."id", ak."name"

            ORDER BY requests DESC
        `

        return rows.map((row) => ({
            apiKeyId: Number(row.apiKeyId),
            name: row.name,

            requests: Number(row.requests),
            inputTokens: Number(row.inputTokens ?? 0),
            outputTokens: Number(row.outputTokens ?? 0),
            totalTokens: Number(row.totalTokens ?? 0),
            creditsUsed: Number(row.creditsUsed ?? 0),
        }))
    }

    static async getRequests(userId: number, range: string | undefined, page = 1, limit = 20) {
        const startDate = this.getStartDate(range)

        const safePage = Math.max(page, 1)
        const safeLimit = Math.min(Math.max(limit, 1), 100)

        const skip = (safePage - 1) * safeLimit

        const [requests, total] = await prisma.$transaction([
            prisma.usage.findMany({
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                    },
                },

                orderBy: {
                    createdAt: "desc",
                },

                skip,
                take: safeLimit,

                include: {
                    apiKey: {
                        select: {
                            name: true,
                        },
                    },

                    modelProviderMapping: {
                        include: {
                            model: true,
                        },
                    },

                    attempts: {
                        where: {
                            status: "success",
                        },

                        include: {
                            modelProviderMapping: {
                                include: {
                                    provider: true,
                                },
                            },
                        },
                    },
                },
            }),

            prisma.usage.count({
                where: {
                    userId,
                    createdAt: {
                        gte: startDate,
                    },
                },
            }),
        ])

        return {
            requests: requests.map((usage) => ({
                requestId: usage.requestId,

                model: usage.modelProviderMapping.model.name,

                provider: usage.attempts[0]?.modelProviderMapping.provider.name ?? "Unknown",

                apiKeyName: usage.apiKey.name,

                inputTokens: usage.inputTokenCount,

                outputTokens: usage.outputTokenCount,

                totalTokens: usage.totalTokenCount,

                creditsUsed: usage.creditsConsumed,

                status: usage.status,

                latencyMs: usage.latencyMs,

                streaming: usage.streaming,

                createdAt: usage.createdAt,
            })),

            page: safePage,
            limit: safeLimit,
            total,
            totalPages: Math.ceil(total / safeLimit),
        }
    }

    static async getRequest(userId: number, requestId: string) {
        const usage = await prisma.usage.findFirst({
            where: {
                userId,
                requestId,
            },

            include: {
                apiKey: {
                    select: {
                        name: true,
                    },
                },

                modelProviderMapping: {
                    include: {
                        model: true,
                        provider: true,
                    },
                },

                conversation: true,

                attempts: {
                    orderBy: {
                        attemptNumber: "asc",
                    },

                    include: {
                        modelProviderMapping: {
                            include: {
                                model: true,
                                provider: true,
                            },
                        },
                    },
                },
            },
        })

        if (!usage) {
            return null
        }

        return {
            requestId: usage.requestId,

            model: usage.modelProviderMapping.model.name,

            provider:
                usage.attempts.find((attempt) => attempt.status === "success")?.modelProviderMapping
                    .provider.name ?? usage.modelProviderMapping.provider.name,

            apiKeyName: usage.apiKey.name,

            inputTokens: usage.inputTokenCount,

            outputTokens: usage.outputTokenCount,

            totalTokens: usage.totalTokenCount,

            creditsUsed: usage.creditsConsumed,

            status: usage.status,

            latencyMs: usage.latencyMs,

            streaming: usage.streaming,

            createdAt: usage.createdAt,

            conversation: usage.conversation
                ? {
                      input: usage.conversation.input,

                      output: usage.conversation.output,

                      createdAt: usage.conversation.createdAt,
                  }
                : null,

            attempts: usage.attempts.map((attempt) => ({
                attemptNumber: attempt.attemptNumber,

                provider: attempt.modelProviderMapping.provider.name,

                model: attempt.modelProviderMapping.model.name,

                status: attempt.status,

                latencyMs: attempt.latencyMs,

                error: attempt.error,

                inputTokens: attempt.inputTokenCount,

                outputTokens: attempt.outputTokenCount,

                createdAt: attempt.createdAt,
            })),
        }
    }
}
