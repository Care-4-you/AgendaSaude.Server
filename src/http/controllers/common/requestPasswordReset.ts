import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/utils/emails/send-reset-password-email";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { EmailNotFoundError } from "@/use-cases/errors/email/email-notFound-error";

export async function requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
  const requestPasswordResetSchema = z.object({
    email: z.string().email(),
  });

  try {
    const { email } = requestPasswordResetSchema.parse(request.body);

    let user = null;
    let userName = "";
    let role = "";

    const pacient = await prisma.pacient.findUnique({
      where: { email }
    });

    if (pacient) {
      user = pacient;
      userName = pacient.name;
      role = "pacient";
    } else {
      const clinic = await prisma.clinic.findUnique({
        where: { email }
      });

      if (clinic) {
        user = clinic;
        userName = clinic.name;
        role = "clinic";
      }
    }

    if (!user) {
      throw new EmailNotFoundError();
    }

    const resetToken = jwt.sign(
      {
        email: user.email,
        id: user.id,
        type: "passwordReset",
        role,
        version: Date.now(),
      },
      env.JWT_SECRET,
      {
        expiresIn: "4h",
      }
    );

    await prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        userType: role,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
        used: false
      }
    });

    await sendResetPasswordEmail(
      email,
      userName,
      resetToken,
      role
    );

    return reply.status(200).send({
      message: "Link de redefinição de senha enviado com sucesso. Por favor, verifique seu email."
    });
  } catch (error: any) {
    if (error instanceof EmailNotFoundError) {
      return reply.status(404).send({
        message: error.message
      });
    }

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Dados de entrada inválidos",
        errors: error.format()
      });
    }

    console.error(error);
    return reply.status(500).send({
      message: "Erro interno do servidor ao processar a solicitação"
    });
  }
}