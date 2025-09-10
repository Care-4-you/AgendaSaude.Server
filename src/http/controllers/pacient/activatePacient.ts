import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const activatePacient = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const activatePacientSchema = z.object({
    token: z.string(),
  });

  try {
    const { token } = activatePacientSchema.parse(request.query);

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      email: string;
      type: string;
    };

    const { email, type } = payload;

    if (type !== "pacientActivation") {
      return reply.status(400).send({
        message: "Invalid activation token."
      });
    }

    const pacient = await prisma.pacient.findUnique({
      where: { email },
    });

    if (!pacient) {
      return reply.status(404).send({
        message: "Pacient not found."
      });
    }

    if (pacient.isAuthenticated) {
      return reply.status(200).send({
        message: "Pacient account is already activated."
      });
    }

    await prisma.pacient.update({
      where: { id: pacient.id },
      data: { isAuthenticated: true },
    });

    return reply.status(200).send({
      message: "Pacient account activated successfully."
    });
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return reply.status(401).send({
        message: "Invalid or expired activation token. Please request a new activation link."
      });
    }

    throw error;
  }
};
