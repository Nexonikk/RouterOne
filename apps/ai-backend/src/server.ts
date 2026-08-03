import app from "./app.js"

const PORT = Number(process.env.PORT) || 4000

app.listen(PORT)

console.log(`🦊 Elysia AI Backend is running at ${app.server?.hostname}:${app.server?.port}`)
