import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type VerifyMedicResponse =
  | {
    exists: true;
    message: string;
    name: string;
    number: string;
    state: string;
  }
  | {
    exists: false;
    message: string;
    number: string;
    state: string;
  };

export const verifyMedic = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const verifyMedicSchema = z.object({
    number: z.string().min(1, "Número do CRM obrigatório"),
    state: z.string().min(2).max(2, "Estado deve ter 2 letras"),
  });

  try {
    // Validação dos dados da query
    const { state, number } = verifyMedicSchema.parse(request.query);

    // Verificação se existe algum médico com esse CRM e Estado
    const medic = await prisma.medic.findFirst({
      where: {
        crm: {
          some: {
            number,
            state,
          },
        },
      },
      select: {
        name: true,
      },
    });

    if (medic) {
      const response: VerifyMedicResponse = {
        exists: true,
        message: "Médico já cadastrado no sistema.",
        name: medic.name,
        number,
        state,
      };

      return reply.status(200).send(response);
    } else {
      const response: VerifyMedicResponse = {
        exists: false,
        message: "Médico não cadastrado no sistema.",
        number,
        state,
      };

      return reply.status(200).send(response);
    }
  } catch (error) {
    console.error("Erro ao verificar médico:", error);

    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Erro ao processar os dados. Verifique o formato dos campos.",
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return reply.status(500).send({
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};