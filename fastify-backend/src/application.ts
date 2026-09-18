import Fastify from "fastify";
import cors from "@fastify/cors";

import authPlugin from "./plugins/auth.js";
import authRoutes from "./modules/auth/routes.js";
import profileRoutes from "./modules/profile/routes.js";

export function buildApplication() {
  const fastify = Fastify({
    logger: true,
  });

  fastify.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
  });

  fastify.register(authRoutes, {
    prefix: "/api/auth",
  });

  fastify.register((protectedApp) => {
    protectedApp.register(authPlugin);
    protectedApp.register(profileRoutes, {
      prefix: "/api",
    });
  });

  return fastify;
}
