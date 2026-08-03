import { Elysia } from "elysia"
import { prisma } from "db"

export const modelRoutes = new Elysia({ prefix: "/models" })

    .get("/", async () => {
        const models = await prisma.model.findMany()
        return models
    })

    .get("/:company", async ({ params }) => {
        const company = await prisma.company.findFirst({
            where: {
                name: {
                    equals: params.company,
                    mode: "insensitive",
                },
            },
            include: {
                models: true,
            },
        })

        return company?.models ?? []
    })
