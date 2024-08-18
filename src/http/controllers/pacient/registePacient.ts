import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";
import { PacientAlreadyExistsError } from "@/use-cases/errors/pacient/pacient-already-exists-error";
import { makePacientUseCase } from "@/use-cases/factories/pacient/make-pacient-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const registerPacient = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z
    .object({
      name: z.string(),
      phone: z.string(),
      email: z.string().email(),
      password: z.string(),
      passwordConfirmation: z.string(),
      birth_date: z.string(),
      cpf: z.string().max(11),
      gender: z.string(),
      address: z.string(),
      cep: z.string(),
      city: z.string(),
      state: z.string(),
      neighborhood: z.string(),
      complement: z.string(),
    })
    .superRefine(({ passwordConfirmation, password }, ctx) => {
      if (passwordConfirmation !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["passwordConfirmation"],
        });
      }
    });

  const {
    name,
    address,
    phone,
    password,
    birth_date,
    email,
    gender,
    cpf,
    cep,
    city,
    state,
    complement,
    neighborhood,
  } = registerBodySchema.parse(request.body);

  try {
    const registerPacientUseCase = makePacientUseCase();

    const pacient = await registerPacientUseCase.execute({
      name,
      address,
      phone,
      password,
      birth_date,
      email,
      gender,
      cpf,
      cep,
      city,
      state,
      complement,
      neighborhood,
    });

    return reply.status(201).send({
      message: "Pacient successfully created!",
      data: pacient,
    });
  } catch (error) {
    if (error instanceof PacientAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    } else if (error instanceof InvalidDateError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
};
