import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../../lib/auth/auth.js";
import type { FastifyRequest, FastifyReply } from "fastify";

export async function authController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
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
    request.log.error(error, "Authentication Error:");
    return reply.status(500).send({
      error: "Internal authentication error",
      code: "AUTH_FAILURE",
    });
  }
}
