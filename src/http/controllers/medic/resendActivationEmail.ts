import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { sendActivationEmail } from "@/utils/email/sendActivationEmail";
import { PrismaMedicsRepository } from "@/repositories/prisma/prisma-medics-repository";

export const resendActivationEmail = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const resendActivationSchema = z.object({
    email: z.string().email(),
  });

  try {
    const { email } = resendActivationSchema.parse(request.body);

    const medicsRepository = new PrismaMedicsRepository();
    const medic = await medicsRepository.findByEmail(email);

    if (!medic) {
      return reply.status(404).send({
        message: "Médico não encontrado."
      });
    }

    if (medic.isAuthenticated) {
      return reply.status(200).send({
        message: "Conta do médico já está ativada."
      });
    }

    const activationToken = jwt.sign(
      {
        email: medic.email,
        type: "medicActivation"
      },
      env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    await sendActivationEmail(
      medic.email,
      medic.name,
      activationToken,
      "medics"
    );

    return reply.status(200).send({
      message: "Email de ativação foi enviado. Verifique sua caixa de entrada."
    });
  } catch (error) {
    throw error;
  }
};
