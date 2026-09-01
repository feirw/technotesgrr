import { fromNodeHeaders } from "better-auth/node";
import fp from "fastify-plugin";
import { auth } from "../lib/auth/auth.js";

export default fp(async (fastify, options) => {
  fastify.decorateRequest("user", null);
  fastify.decorateRequest("session", null);

  fastify.addHook("preHandler", async (request, reply) => {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(request.headers),
    });

    if (!session) {
      return reply.status(401).send({
        error: "Unauthorized",
      });
    }

    request.user = session.user;
    request.session = session.session;
  });
});
