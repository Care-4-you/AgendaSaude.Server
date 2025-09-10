import { FastifyRequest, FastifyReply } from "fastify";
import { z, ZodError } from "zod";
import jwt from "jsonwebtoken";
import { env } from "@/env";

import { makeMedicsUseCase } from "@/use-cases/factories/medic/make-medic-use-case";
import {
  MedicAlreadyExistsError,
  MedicCrmAlreadyExistsError,
} from "@/use-cases/errors/medic/medic-already-exists-error";
import {
  MaxCrmExceededError,
  DuplicateCrmInRequestError,
  InvalidCrmFormatError,
} from "@/use-cases/errors/medic/medic-crm-error";
import { sendActivationEmail } from "@/utils/email/sendActivationEmail";

export const registerMedic = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  // Ajusta schema para o formato exato do front
  const registerBodySchema = z
    .object({
      acceptTerm: z.boolean(),
      cellPhone: z.string(),
      councils: z.object({
        value: z.string(),
        label: z.string(),
      }),
      councilsNumber: z.string(),
      councilsUF: z.object({
        value: z.string(),
        label: z.string(),
      }),
      email: z.string().email(),
      gender: z.object({
        value: z.string(),
        label: z.string(),
      }),
      isWhatsapp: z.boolean(),
      name: z.string(),
      password: z.string(),
      passwordConfirmation: z.string(),
      phone: z.string(),
      specialty: z.object({
        value: z.string(),
        label: z.string(),
      }),
      whatsapp: z.string(),
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

    if (!body.councilsNumber)
      return reply.status(400).send({ message: "Número do conselho obrigatório" });

    const registerMedicUseCase = makeMedicsUseCase();

    // Monta dados para o use case no formato esperado
    const dataToExecute = {
      name: body.name,
      cellPhone: body.cellPhone,
      phone: body.phone,
      whatsapp: body.whatsapp,
      email: body.email,
      password: body.password,
      passwordConfirmation: body.passwordConfirmation,
      gender: body.gender,
      city: "",  // Não vem do front, pode ser vazio ou default
      state: "", // idem
      specialty: body.specialty,
      councils: body.councils,
      councilsNumber: body.councilsNumber,
      councilsUF: body.councilsUF,
      acceptTerm: body.acceptTerm,
      isWhatsapp: body.isWhatsapp,
    };

    const { medic } = await registerMedicUseCase.execute(dataToExecute);

    // Gerar token de ativação
    const activationToken = jwt.sign(
      {
        email: medic.email,
        type: "medicActivation"
      },
      env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Enviar email de ativação
    await sendActivationEmail(
      medic.email,
      medic.name,
      activationToken,
      "medics"
    );

    return reply.status(201).send({
      message: "Médico registrado com sucesso! Verifique seu email para ativar sua conta.",
      data: {
        ...medic,
        password_hash: undefined,
      },
    });
  } catch (error: any) {
    console.error("Erro ao registrar médico:", error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Erro de validação nos dados enviados.",
        issues: error.issues,
      });
    }

    if (
      error instanceof MedicAlreadyExistsError ||
      error.name === "MedicAlreadyExistsError"
    ) {
      return reply.status(409).send({ message: error.message });
    }

    if (
      error instanceof MedicCrmAlreadyExistsError ||
      error.name === "MedicCrmAlreadyExistsError"
    ) {
      return reply.status(409).send({ message: error.message });
    }

    if (
      error instanceof MaxCrmExceededError ||
      error.name === "MaxCrmExceededError"
    ) {
      return reply.status(400).send({ message: error.message });
    }

    if (
      error instanceof DuplicateCrmInRequestError ||
      error.name === "DuplicateCrmInRequestError"
    ) {
      return reply.status(400).send({ message: error.message });
    }

    if (
      error instanceof InvalidCrmFormatError ||
      error.name === "InvalidCrmFormatError"
    ) {
      return reply.status(400).send({ message: error.message });
    }

    if (error.message && error.message.includes("required")) {
      return reply.status(400).send({ message: error.message });
    }

    return reply.status(500).send({
      message: "Erro interno do servidor.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
