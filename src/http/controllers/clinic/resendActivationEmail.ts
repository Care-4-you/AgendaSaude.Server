import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendActivationEmail } from "@/utils/emails/send-activation-email";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export const resendActivationEmail = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const resendActivationSchema = z.object({
    email: z.string().email(),
  });

  try {
    const { email } = resendActivationSchema.parse(request.body);

    // Buscar a clínica pelo email
    const clinic = await prisma.clinic.findUnique({
      where: { email },
    });

    if (!clinic) {
      return reply.status(404).send({
        message: "Clinic not found."
      });
    }

    // Se a clínica já estiver autenticada, apenas informar
    if (clinic.isAuthenticated) {
      return reply.status(200).send({
        message: "Clinic account is already activated."
      });
    }

    // Gerar token de ativação com jsonwebtoken
    const activationToken = jwt.sign(
      {
        email: clinic.email,
        type: "clinicActivation"
      },
      env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Reenviar email de ativação
    await sendActivationEmail(
      clinic.email,
      clinic.name,
      activationToken
    );

    return reply.status(200).send({
      message: "Activation email has been sent. Please check your inbox."
    });
  } catch (error) {
    throw error;
  }
};