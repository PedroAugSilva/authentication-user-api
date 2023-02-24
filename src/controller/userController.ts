import { FastifyRequest as Request } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { GenerateRefreshToken } from "../provider/GenerateRefreshToken";

export class UserController {
  async SignIn(req: Request) {
    const userBody = z.object({
      username: z.string(),
      password: z.string(),
    });

    const { username, password } = userBody.parse(req.body);

    const alreadyExistUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (!alreadyExistUser) {
      throw new Error("Username or password invalid");
    }

    const passwordCompare = await compare(password, alreadyExistUser.password);

    if (!passwordCompare) {
      throw new Error("Username or password invalid");
    }
    const token = sign({}, "fe3697b4-2a22-40f1-bc57-f62f1d22d612", {
      subject: alreadyExistUser.id,
      expiresIn: "20s",
    });

    await prisma.refreshToken.deleteMany({
      where: {
        user_id: alreadyExistUser.id,
      },
    });

    const generateRefreshToken = new GenerateRefreshToken();
    const refreshToken = await generateRefreshToken.generate(
      alreadyExistUser.id
    );
    return { token, refreshToken };
  }

  async SignUp(req: Request) {
    const userBody = z.object({
      username: z.string(),
      password: z.string(),
    });

    const { username, password } = userBody.parse(req.body);

    const alreadyExistUser = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (alreadyExistUser) {
      throw new Error("Username or password invalid");
    }

    const passwordHash = await hash(password, 8);

    await prisma.user.create({
      data: {
        username,
        password: passwordHash,
      },
    });
  }
}
