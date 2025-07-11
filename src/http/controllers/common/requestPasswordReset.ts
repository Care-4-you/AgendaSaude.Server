import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { EmailNotFoundError } from "@/use-cases/errors/email/email-notFound-error";
import { sendResetPasswordEmail } from "@/utils/email/sendResetPasswordEmail";

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

export async function requestPasswordReset(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { email } = requestPasswordResetSchema.parse(request.body);

    const [pacient, medic, clinic] = await Promise.all([
      prisma.pacient.findUnique({ where: { email } }),
      prisma.medic.findUnique({ where: { email } }),
      prisma.clinic.findUnique({ where: { email } })
    ]);

    let user, role;
    if (medic) {
      user = medic;
      role = "medic";
    } else if (clinic) {
      user = clinic;
      role = "clinic";
    } else if (pacient) {
      user = pacient;
      role = "pacient";
    } else {
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
      { expiresIn: "4h" }
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

    const getEmailPath = (role: string): UserType => {
      switch (role) {
        case "medic":
          return "medics";
        case "clinic":
          return "clinics";
        case "pacient":
          return "pacients";
        default:
          throw new Error("Invalid user role");
      }
    }

    const emailPath: UserType = getEmailPath(role);
    await sendResetPasswordEmail(user.email, user.name, resetToken, emailPath);

    return reply.status(200).send({
      message: "Link de redefinição de senha enviado com sucesso. Por favor, verifique seu email."
    });

  } catch (error: any) {
    if (error instanceof EmailNotFoundError) {
      return reply.status(404).send({ message: error.message });
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