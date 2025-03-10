import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const activateClinic = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const activateClinicSchema = z.object({
    token: z.string(),
  });

  try {
    const { token } = activateClinicSchema.parse(request.query);

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      email: string;
      type: string;
    };

    const { email, type } = payload;

    if (type !== "clinicActivation") {
      return reply.status(400).send({
        message: "Invalid activation token."
      });
    }

    const clinic = await prisma.clinic.findUnique({
      where: { email },
    });

    if (!clinic) {
      return reply.status(404).send({
        message: "Clinic not found."
      });
    }

    if (clinic.isAuthenticated) {
      return reply.status(200).send({
        message: "Clinic account is already activated."
      });
    }

    await prisma.clinic.update({
      where: { id: clinic.id },
      data: { isAuthenticated: true },
    });

    return reply.status(200).send({
      message: "Clinic account activated successfully."
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