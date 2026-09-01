import type { User, Session } from "better-auth/types";

declare module "fastify" {
  interface FastifyRequest {
    user: User | null;
    session: Session | null;
  }
}
