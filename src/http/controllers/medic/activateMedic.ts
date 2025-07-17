import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { PrismaMedicsRepository } from "@/repositories/prisma/prisma-medics-repository";

export const activateMedic = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const activateMedicSchema = z.object({
    token: z.string(),
  });

  try {
    const { token } = activateMedicSchema.parse(request.query);

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      email: string;
      type: string;
    };

    const { email, type } = payload;

    if (type !== "medicActivation") {
      return reply.status(400).send({
        message: "Invalid activation token."
      });
    }

    // Buscar médico pelo email
    const medicsRepository = new PrismaMedicsRepository();
    const medic = await medicsRepository.findByEmail(email);

    if (!medic) {
      return reply.status(404).send({
        message: "Medic not found."
      });
    }

    if (medic.isAuthenticated) {
      return reply.status(200).send({
        message: "Medic account is already activated."
      });
    }

    await prisma.medic.update({
      where: { id: medic.id },
      data: { isAuthenticated: true },
    });

    return reply.status(200).send({
      message: "Medic account activated successfully."
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
