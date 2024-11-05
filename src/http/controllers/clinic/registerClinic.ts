import { ClinicAlreadyExistsError } from "@/use-cases/errors/clinic/clinic-already-exist-error";
import { makeClinicUseCase } from "@/use-cases/factories/clinic/make-clinic-use-case";
import { cnpjFormatRegex, isValidCNPJ } from "@/utils/cnpjValidFormated";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const registerClinic = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z
    .object({
      name: z.string(),
      specialty: z.string(),
      phone: z.string(),
      email: z.string().email(),
      cnpj: z
        .string()
        .refine((cnpj) => cnpjFormatRegex.test(cnpj) && isValidCNPJ(cnpj), {
          message: "Invalid CNPJ format or value",
        }),
      password: z.string(),
      passwordConfirmation: z.string(),
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
    specialty,
    phone,
    email,
    cnpj,
    password,
    address,
    cep,
    city,
    state,
    neighborhood,
    complement,
  } = registerBodySchema.parse(request.body);

  try {
    const registerClinicUseCase = makeClinicUseCase();

    const clinic = await registerClinicUseCase.execute({
      name,
      specialty,
      phone,
      email,
      cnpj,
      password,
      address,
      cep,
      city,
      state,
      neighborhood,
      complement,
    });

    return reply.status(201).send({
      message: "Clinic successfully created!",
      data: clinic,
    });
  } catch (error) {
    if (error instanceof ClinicAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    }

    throw error;
  }
};
