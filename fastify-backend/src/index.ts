import Fastify, { type FastifyInstance } from "fastify";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth/auth.ts";

const fastify: FastifyInstance = Fastify({
  logger: true,
});

fastify.route({
  method: ["GET", "POST"],
  url: "/api/auth/*",
  async handler(request, reply) {
    try {
      const url = new URL(request.url, `https://${request.headers.host}`);
      const headers = fromNodeHeaders(request.headers);

      const req = new Request(url.toString(), {
        method: request.method,
        headers,
        ...(request.body ? { body: JSON.stringify(request.body) } : {}),
      });

      const response = await auth.handler(req);

      reply.status(response.status);
      response.headers.forEach((value, key) => reply.header(key, value));
      return reply.send(response.body ? await response.text() : null);
    } catch (error) {
      fastify.log.error(error, "Authentication Error:");
      return reply.status(500).send({
        error: "Internal authentication error",
        code: "AUTH_FAILURE",
      });
    }
  },
});

fastify.get("/api/@me", async function (request, reply) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(request.headers),
  });

  if (!session) {
    return reply.status(401).send({ error: "Unauthorized!" });
  }

  return reply.send(session);
});

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }

  fastify.log.info(`server listening on ${address}`);
});
