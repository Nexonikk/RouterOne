import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"

import { UsageModel } from "./models.js"
import { UsageService } from "./service.js"

export const app = new Elysia({ prefix: "usage" })

    .use(
        jwt({
            name: "jwt",
            secret: process.env.JWT_SECRET!,
        }),
    )

    .resolve(async ({ cookie: { auth }, status, jwt }) => {
        if (!auth) {
            return status(401)
        }

        const decoded = await jwt.verify(auth.value as string)

        if (!decoded || !decoded.userId) {
            return status(401)
        }

        return {
            userId: decoded.userId as string,
        }
    })

    // Summary cards

    .get(
        "/summary",
        async ({ userId, query }) => {
            return await UsageService.getSummary(Number(userId), query.range)
        },
        {
            query: UsageModel.rangeQuery,

            response: {
                200: UsageModel.summaryResponse,
            },
        },
    )

    // Chart

    .get(
        "/timeseries",
        async ({ userId, query }) => {
            return await UsageService.getTimeseries(Number(userId), query.range)
        },
        {
            query: UsageModel.rangeQuery,

            response: {
                200: UsageModel.timeseriesResponse,
            },
        },
    )

    // Model breakdown

    .get(
        "/models",
        async ({ userId, query }) => {
            return await UsageService.getModels(Number(userId), query.range)
        },
        {
            query: UsageModel.rangeQuery,

            response: {
                200: UsageModel.modelsResponse,
            },
        },
    )

    // Provider breakdown

    .get(
        "/providers",
        async ({ userId, query }) => {
            return await UsageService.getProviders(Number(userId), query.range)
        },
        {
            query: UsageModel.rangeQuery,

            response: {
                200: UsageModel.providersResponse,
            },
        },
    )

    // API key breakdown

    .get(
        "/api-keys",
        async ({ userId, query }) => {
            return await UsageService.getApiKeys(Number(userId), query.range)
        },
        {
            query: UsageModel.rangeQuery,

            response: {
                200: UsageModel.apiKeysResponse,
            },
        },
    )

    // Request history

    .get(
        "/requests",
        async ({ userId, query }) => {
            const page = Number(query.page ?? "1")
            const limit = Number(query.limit ?? "20")

            return await UsageService.getRequests(Number(userId), query.range, page, limit)
        },
        {
            query: UsageModel.requestsQuery,

            response: {
                200: UsageModel.requestsResponse,
            },
        },
    )

    // Single request detail

    .get(
        "/requests/:requestId",
        async ({ userId, params, status }) => {
            const request = await UsageService.getRequest(Number(userId), params.requestId)

            if (!request) {
                return status(404, {
                    message: "Usage request not found",
                })
            }

            return request
        },
        {
            params: t.Object({
                requestId: t.String(),
            }),

            response: {
                200: UsageModel.requestDetailResponse,

                404: t.Object({
                    message: t.Literal("Usage request not found"),
                }),
            },
        },
    )
