import app from "./app.js" // Note: importing the default export now

const PORT = Number(process.env.PORT) || 3000

app.listen(PORT)

console.log(`🦊 Elysia running at http://localhost:${PORT}`)
