import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const getClinicSpecialties = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const getClinicSpecialtiesSchema = z.object({
    clinicId: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error("ID da clínica deve ser um número positivo");
      }
      return num;
    }),
  });

  try {
    const { clinicId } = getClinicSpecialtiesSchema.parse(request.params);

    // Busca a clínica para verificar se existe
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId }
    });

    if (!clinic) {
      return reply.status(404).send({
        message: "Clínica não encontrada."
      });
    }

    // Busca todas as especialidades dos médicos desta clínica
    const specialties = await prisma.medicSpecialty.findMany({
      where: {
        medic: {
          clinicId: clinicId,
          isAuthenticated: true
        }
      },
      select: {
        specialty: true
      },
      distinct: ['specialty']
    });

    // Formata as especialidades
    const formattedSpecialties = specialties.map(spec => ({
      value: spec.specialty.toLowerCase().replace(/\s+/g, '-'),
      label: spec.specialty
    }));

    return reply.status(200).send({
      message: "Especialidades da clínica recuperadas com sucesso.",
      data: {
        clinicId,
        specialties: formattedSpecialties.sort((a, b) => a.label.localeCompare(b.label)),
        totalSpecialties: formattedSpecialties.length
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Formato de ID da clínica inválido.",
        errors: error.errors,
      });
    }

    console.error("Erro ao buscar especialidades da clínica:", error);
    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  }
};