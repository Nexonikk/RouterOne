import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"

import { app as authApp } from "./modules/auth/index"
import { app as apiKeyApp } from "./modules/apiKeys/index"
import { app as modelsApp } from "./modules/models/index"
import { app as paymentsApp } from "./modules/payments/index"

export const app = new Elysia()
    .get("/", () => ({
        status: "ok",
        service: "routerone-backend",
        runtime: process.env.VERCEL ? "vercel" : "local",
    }))
    .use(
        cors({
            origin: process.env.FRONTEND_URL || "http://localhost:3001",
            credentials: true,
        }),
    )
    .use(authApp)
    .use(apiKeyApp)
    .use(modelsApp)
    .use(paymentsApp)

export type App = typeof app
