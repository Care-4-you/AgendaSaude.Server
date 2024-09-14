import { InvalidDataPassedError } from "@/use-cases/errors/invalid-data-passed-error";
import { PacientNotFoundError } from "@/use-cases/errors/pacient/pacient-not-found-error";
import { makeGetPacientProfileUseCase } from "@/use-cases/factories/pacient/make-get-pacient-profile-use-case";
import { convertStringToNumber } from "@/utils/convert-string-to-number";
import { FastifyReply, FastifyRequest } from "fastify";

export const profilePacient = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const getPacientProfile = makeGetPacientProfileUseCase();

    const pacientId = request.user.sub;

    const pacientIdNumber = convertStringToNumber(pacientId);

    const { pacient } = await getPacientProfile.execute({
      pacientId: pacientIdNumber,
    });

    return reply.status(200).send({
      pacient: {
        ...pacient,
        password_hash: undefined,
      },
    });
  } catch (error) {
    if (error instanceof InvalidDataPassedError) {
      return reply.status(409).send({ message: error.message, error });
    } else if (error instanceof PacientNotFoundError) {
      return reply.status(409).send({ message: error.message, error });
    } else {
      throw error;
    }
  }
};
