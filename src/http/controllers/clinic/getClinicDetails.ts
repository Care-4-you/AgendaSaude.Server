import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetClinicDetailsUseCase } from "@/use-cases/factories/clinic/make-get-clinic-details-use-case";

export const getClinicDetails = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const getClinicDetailsSchema = z.object({
    id: z.string().transform((val) => {
      const num = parseInt(val, 10);
      if (isNaN(num) || num <= 0) {
        throw new Error("ID deve ser um número positivo");
      }
      return num;
    }),
  });

  try {
    const { id } = getClinicDetailsSchema.parse(request.params);

    const getClinicDetailsUseCase = makeGetClinicDetailsUseCase();

    const { clinic } = await getClinicDetailsUseCase.execute({ id });

    if (!clinic) {
      return reply.status(404).send({
        message: "Clínica não encontrada."
      });
    }

    // Retorna apenas dados não sensíveis
    const clinicDetails = {
      id: clinic.id,
      name: clinic.name,
      phone: clinic.phone,
      cellPhone: clinic.cellPhone,
      whatsapp: clinic.whatsapp,
      hasNumber: clinic.hasNumber,
      houseNumber: clinic.houseNumber,
      email: clinic.email,
      cnpj: clinic.cnpj,
      address: clinic.address,
      cep: clinic.cep,
      city: clinic.city,
      state: clinic.state,
      neighborhood: clinic.neighborhood,
      complement: clinic.complement,
      latitude: clinic.latitude,
      longitude: clinic.longitude,
      createdAt: clinic.createdAt,
      specialty: clinic.specialty || [],
      healthInsurance: clinic.healthInsurance || [],
      // Não incluir campos sensíveis como password_hash, isAuthenticated
    };

    return reply.status(200).send({
      message: "Detalhes da clínica recuperados com sucesso.",
      data: clinicDetails,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Formato de ID da clínica inválido.",
        errors: error.errors,
      });
    }

    console.error("Erro ao buscar detalhes da clínica:", error);
    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  }
};
