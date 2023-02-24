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
    verify(token, process.env.JWT_KEY!);
    return done();
  } catch (error) {
    throw new Error("Unauthorized");
  }
};
