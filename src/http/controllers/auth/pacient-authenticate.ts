import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makePacientAuthenticateUseCase } from "@/use-cases/factories/auth/make-pacient-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const pacientAuthenticate = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const authenticateBodySchema = z
    .object({
      email: z.string().email(),
      password: z.string(),
      passwordConfirmation: z.string(),
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

  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const pacientAuthenticate = makePacientAuthenticateUseCase();

    const { pacient } = await pacientAuthenticate.execute({
      email,
      password,
    });

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: pacient.id.toString(),
        },
      },
    );

    return reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: error.message });
    }

    throw error;
  }
};
