// apps/backend/src/index.ts
import { app } from "./app.js"

export type { App } from "./app.js"

// Vercel expects the app instance as the default export
export default app
