import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";
import { makePacientUseCase } from "@/use-cases/factories/pacient/make-pacient-use-case";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const registerMedic = async (
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
      cpf: z.string().max(11), // apenas numero no CPF ex: 54879521061
      gender: z.string(),
      city: z.string(),
      state: z.string(),
      specialty: z.string().array(),
      crm: z.string().array(),
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
    phone,
    email,
    password,
    cpf,
    city,
    crm,
    gender,
    state,
    specialty,
  } = registerBodySchema.parse(request.body);

  try {
    const registerPacientUseCase = makePacientUseCase();

    // const { pacient } = await registerPacientUseCase.execute({
    //   name,
    //   address,
    //   phone,
    //   password,
    //   birth_date,
    //   email,
    //   gender,
    //   cpf,
    //   cep,
    //   city,
    //   state,
    //   complement,
    //   neighborhood,
    // });

    // const activationToken = await reply.jwtSign(
    //   {
    //     email: pacient.email,
    //   },
    //   {
    //     expiresIn: "6h", // Coloque diretamente a propriedade 'expiresIn'
    //   },
    // );

    // return reply.status(201).send({
    //   data: pacient,
    //   activationToken,
    // });
  } catch (error) {
    throw error;
  }
};
