import type { FastifyInstance } from "fastify";
import { authController } from "./controller.js";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.route({
    method: ["GET", "POST"],
    url: "/*",
    handler: authController,
  });
}
