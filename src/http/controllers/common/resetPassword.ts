import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { hashPassword } from "@/utils/hash-password";

export async function resetPassword(request: FastifyRequest, reply: FastifyReply) {
  const resetPasswordSchema = z.object({
    token: z.string(),
    password: z.string().min(6)
  });

  try {
    const { token, password } = resetPasswordSchema.parse(request.body);

    const resetTokenRecord = await prisma.passwordResetToken.findUnique({
      where: { token }
    });

    if (!resetTokenRecord || resetTokenRecord.used) {
      return reply.status(400).send({
        message: "Token de redefinição de senha inválido ou já utilizado."
      });
    }

    if (resetTokenRecord.expiresAt < new Date()) {
      return reply.status(400).send({
        message: "Token de redefinição de senha expirado."
      });
    }

    const payload = jwt.verify(token, env.JWT_SECRET) as {
      email: string;
      id: number;
      type: string;
      role: "pacient" | "clinic";
    };

    if (payload.type !== "passwordReset") {
      return reply.status(400).send({
        message: "Token inválido para redefinição de senha."
      });
    }

    // Gera o hash da nova senha
    const password_hash = await hashPassword(password);

    switch (payload.role) {
      case "pacient":
        await prisma.pacient.update({
          where: { id: payload.id },
          data: { password_hash }
        });
        break;

      case "clinic":
        await prisma.clinic.update({
          where: { id: payload.id },
          data: { password_hash }
        });
        break;
    }

    await prisma.passwordResetToken.update({
      where: { id: resetTokenRecord.id },
      data: { used: true }
    });

    return reply.status(200).send({
      message: "Senha atualizada com sucesso."
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Dados de entrada inválidos",
        errors: error.format()
      });
    }

    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return reply.status(400).send({
        message: "Token inválido ou expirado."
      });
    }

    console.error(error);
    return reply.status(500).send({
      message: "Erro interno do servidor ao processar a solicitação"
    });
  }
}