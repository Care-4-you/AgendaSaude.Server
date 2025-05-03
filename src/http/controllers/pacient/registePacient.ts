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
      name: z.string().min(1),
      phone: z.string().min(8),
      cellPhone: z.string().min(8),
      whatsapp: z.string().min(8),
      isWhatsapp: z.boolean(),
      hasNumber: z.boolean(),
      houseNumber: z.string().min(1),
      acceptTerm: z.literal(true),
      email: z.string().email(),
      password: z.string().min(6),
      passwordConfirmation: z.string().min(6),
      birth_date: z.coerce.date(),
      cpf: z.string().length(11),
      gender: z.object({
        value: z.string(),
        label: z.string(),
      }),
      address: z.string().min(1),
      cep: z.string().min(8),
      city: z.string().min(1),
      state: z.string().min(1),
      neighborhood: z.string().min(1),
      complement: z.string().optional(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      path: ["passwordConfirmation"],
      message: "The passwords did not match",
    })
    .refine(
      (data) => !data.isWhatsapp || data.whatsapp === data.cellPhone,
      {
        path: ["whatsapp"],
        message: "When isWhatsapp is true, whatsapp must equal cellPhone",
      },
    )
    .refine(
      (data) => data.hasNumber || data.houseNumber === "S/N",
      {
        path: ["houseNumber"],
        message: "When hasNumber is false, houseNumber must be 'S/N'",
      },
    );

  const {
    name,
    phone,
    cellPhone,
    whatsapp,
    isWhatsapp,
    hasNumber,
    houseNumber,
    acceptTerm,
    email,
    password,
    birth_date,
    cpf,
    gender,
    address,
    cep,
    city,
    state,
    neighborhood,
    complement,
  } = registerBodySchema.parse(request.body);

  try {
    const registerPacientUseCase = makePacientUseCase();

    const { pacient } = await registerPacientUseCase.execute({
      name,
      phone,
      cellPhone,
      whatsapp,
      isWhatsapp,
      hasNumber,
      houseNumber,
      acceptTerm,
      email,
      password,
      birth_date: birth_date,
      cpf,
      gender,        
      address,
      cep,
      city,
      state,
      neighborhood,
      complement: complement ?? null,
    });

    const activationToken = await reply.jwtSign(
      { email: pacient.email },
      { expiresIn: "6h" },
    );

    return reply.status(201).send({
      data: pacient,
      activationToken,
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
