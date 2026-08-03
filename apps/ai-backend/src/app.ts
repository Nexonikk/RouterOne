import { bearer } from "@elysiajs/bearer"
import { Elysia } from "elysia"
import { node } from "@elysiajs/node"

import { chatRoutes } from "./api/v1/chat.js"
import { modelRoutes } from "./api/v1/models.js"

const app = new Elysia({ adapter: node() })
    .use(bearer())
    .all("/", "RouterOne AI API is working")
    .group("/api/v1", (app) => app.use(chatRoutes).use(modelRoutes))

export type App = typeof app

export default app
