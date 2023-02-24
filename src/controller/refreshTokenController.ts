import { FastifyRequest as Request } from "fastify";
import { sign } from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import z from "zod";
import dayjs from "dayjs";
import { GenerateRefreshToken } from "../provider/GenerateRefreshToken";

export class RefreshTokenControlller {
  async generate(req: Request) {
    const refreshTokenBody = z.object({
      refresh_token: z.string(),
    });

    const { refresh_token } = refreshTokenBody.parse(req.body);

    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        id: refresh_token,
      },
    });

    if (!refreshToken) {
      throw new Error("Token invalid");
    }

    const token = sign({}, process.env.JWT_KEY!, {
      subject: refreshToken.user_id,
      expiresIn: "20s",
    });

    const refreshTokenExpired = dayjs().isAfter(
      dayjs.unix(refreshToken.expiresIn)
    );

    if (refreshTokenExpired) {
      await prisma.refreshToken.deleteMany({
        where: {
          user_id: refreshToken.user_id,
        },
      });

      const generateRefreshToken = new GenerateRefreshToken();
      const newToken = await generateRefreshToken.generate(
        refreshToken.user_id
      );

      return { token, refreshToken: newToken };
    }

    return { token };
  }
}
