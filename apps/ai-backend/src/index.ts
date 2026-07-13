import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { chatRoutes } from "./api/v1/chat";

const app = new Elysia()
  .use(bearer())
  .all('/', 'RouterOne API is working')
  .group("/api/v1", (app) => app.use(chatRoutes))
  .listen(4000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
