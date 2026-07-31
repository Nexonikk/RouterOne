// apps/backend/src/app.ts
import { Elysia } from "elysia"
import { cors } from "@elysiajs/cors"
import { node } from "@elysiajs/node" // Import the Node adapter

import { app as authApp } from "./modules/auth/index.js"
import { app as apiKeyApp } from "./modules/apiKeys/index.js"
import { app as modelsApp } from "./modules/models/index.js"
import { app as paymentsApp } from "./modules/payments/index.js"

// Pass the adapter when creating the app
export const app = new Elysia({ adapter: node() })
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
