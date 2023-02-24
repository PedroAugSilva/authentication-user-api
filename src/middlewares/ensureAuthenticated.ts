import {
  FastifyRequest as Request,
  FastifyReply as Reply,
  HookHandlerDoneFunction as Done,
} from "fastify";

import { verify } from "jsonwebtoken";

export const ensureAuthenticated = (req: Request, reply: Reply, done: Done) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    throw new Error("Unauthorized");
  }

  const [, token] = authToken.split(" ");

  try {
    verify(token, "fe3697b4-2a22-40f1-bc57-f62f1d22d612");
    return done();
  } catch (error) {
    reply.status(401);
    throw new Error("Unauthorized");
  }
};
