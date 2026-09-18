import type { FastifyRequest, FastifyReply } from "fastify";

export async function profileController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.send(request.user);
}
