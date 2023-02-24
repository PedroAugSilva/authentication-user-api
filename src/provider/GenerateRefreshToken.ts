import { prisma } from "../lib/prisma";
import dayjs from "dayjs";

export class GenerateRefreshToken {
  async generate(user_id: string) {
    const expiresIn = dayjs().add(15, "second").unix();

    const refreshToken = await prisma.refreshToken.create({
      data: {
        user_id,
        expiresIn,
      },
    });
    return { refreshToken };
  }
}
