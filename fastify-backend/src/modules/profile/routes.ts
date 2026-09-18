import type { FastifyInstance } from "fastify";
import { profileController } from "./controller.js";

export default async function profileRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: ["GET"],
    url: "/@me",
    handler: profileController,
  });
}
