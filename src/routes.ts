import { FastifyInstance } from "fastify";
import { RefreshTokenControlller } from "./controller/refreshTokenController";
import { UserController } from "./controller/userController";
import { ensureAuthenticated } from "./middlewares/ensureAuthenticated";

export const userRoutes = async (app: FastifyInstance) => {
  const userController = new UserController();
  const refreshTokenControlller = new RefreshTokenControlller();

  app.post("/signin", userController.SignIn);
  app.post("/signup", userController.SignUp);
  app.get("/", { preHandler: ensureAuthenticated }, (req, reply) => {
    return { message: "Welcome!!" };
  });
  app.post("/refresh-token", refreshTokenControlller.generate);
};
