import { FastifyRequest, FastifyReply } from "fastify";
import { z, ZodError } from "zod";
import { makeMedicsUseCase } from "@/use-cases/factories/medic/make-medic-use-case";
import {
  MedicAlreadyExistsError,
  MedicCrmAlreadyExistsError
} from "@/use-cases/errors/medic/medic-already-exists-error";
import {
  MaxCrmExceededError,
  DuplicateCrmInRequestError,
  InvalidCrmFormatError
} from "@/use-cases/errors/medic/medic-crm-error";

export const registerMedic = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z
    .object({
      name: z.string(),
      cpf: z.string(),
      phone: z.string(),
      whatsapp: z.string(),
      email: z.string().email(),
      password: z.string(),
      passwordConfirmation: z.string(),
      gender: z.string(),
      city: z.string(),
      state: z.string(),
      specialty: z.array(z.string()),
      crm: z.array(
        z.object({
          number: z.string(),
          state: z.string(),
        }),
      ),
      clinicId: z.number().nullable(),
      photo: z.string().nullable().optional(),
    })
    .superRefine(({ password, passwordConfirmation }, ctx) => {
      if (password !== passwordConfirmation) {
        ctx.addIssue({
          code: "custom",
          message: "Passwords do not match",
          path: ["passwordConfirmation"],
        });
      }
    });

  try {
    const body = registerBodySchema.parse(request.body);

    const registerMedicUseCase = makeMedicsUseCase();

    const { medic } = await registerMedicUseCase.execute({
      name: body.name,
      cpf: body.cpf,
      phone: body.phone,
      whatsapp: body.whatsapp,
      email: body.email,
      password: body.password,
      gender: body.gender,
      city: body.city,
      state: body.state,
      specialty: body.specialty,
      crm: body.crm,
      clinicId: body.clinicId,
      photo: body.photo,
    });

    return reply.status(201).send({
      message: "Médico registrado com sucesso!",
      data: {
        ...medic,
        password_hash: undefined,
      },
    });
  } catch (error: any) {
    console.error("Erro ao registrar médico:", error);

    // Erro de validação do Zod
    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Erro de validação nos dados enviados.",
        issues: error.issues,
      });
    }

    // Erros de médico já existente
    if (
      error instanceof MedicAlreadyExistsError ||
      error.name === "MedicAlreadyExistsError"
    ) {
      return reply.status(409).send({
        message: error.message
      });
    }

    // Erros de CRM já existente
    if (
      error instanceof MedicCrmAlreadyExistsError ||
      error.name === "MedicCrmAlreadyExistsError"
    ) {
      return reply.status(409).send({
        message: error.message
      });
    }

    // Erro de máximo de CRMs excedido
    if (
      error instanceof MaxCrmExceededError ||
      error.name === "MaxCrmExceededError"
    ) {
      return reply.status(400).send({
        message: error.message
      });
    }

    // Erro de CRM duplicado na requisição
    if (
      error instanceof DuplicateCrmInRequestError ||
      error.name === "DuplicateCrmInRequestError"
    ) {
      return reply.status(400).send({
        message: error.message
      });
    }

    // Erro de formato de CRM inválido
    if (
      error instanceof InvalidCrmFormatError ||
      error.name === "InvalidCrmFormatError"
    ) {
      return reply.status(400).send({
        message: error.message
      });
    }

    // Erros de validação básica (campos obrigatórios)
    if (error.message && error.message.includes('required')) {
      return reply.status(400).send({
        message: error.message
      });
    }

    // Erro interno do servidor
    return reply.status(500).send({
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
