import bearer from "@elysiajs/bearer"
import { Elysia } from "elysia"
import { node } from "@elysiajs/node"
// IMPORTANT: Ensure you use the .js extension for your local imports!
import { chatRoutes } from "./api/v1/chat.js"

const app = new Elysia({ adapter: node() })
    .use(bearer())
    .all("/", "RouterOne AI API is working")
    .group("/api/v1", (app) => app.use(chatRoutes))

export type App = typeof app

// CRITICAL: Export as default for Vercel
export default app
