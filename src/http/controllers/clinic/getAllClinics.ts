import { makeGetAllClinicsUseCase } from "@/use-cases/factories/clinic/make-get-all-clinics-use-case";
import { FastifyRequest, FastifyReply } from "fastify";

export const getAllClinics = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const getAllClinicsUseCase = makeGetAllClinicsUseCase();
    const clinics = await getAllClinicsUseCase.execute();
    return reply.status(200).send({
      message: "Lista de clínicas recuperada com sucesso.",
      data: clinics,
    });
  } catch (error) {
    console.error("Erro ao buscar clínicas:", error);
    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  }
};
