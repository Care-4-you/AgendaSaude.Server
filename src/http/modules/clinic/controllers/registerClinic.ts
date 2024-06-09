import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export const registerClinic = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const registerBodySchema = z.object({
    name: z.string(),
    specialty: z.string(),
    phone: z.string(),
    email: z.string().email(),
    password: z.string(),
    passwordConfirmation: z.string(),
    address: z.string(),
    cep: z.string(),
    city: z.string(),
    state: z.string(),
    neighborhood: z.string(),
    complement: z.string(),
  });

  const {
    name,
    specialty,
    phone,
    email,
    password,
    passwordConfirmation,
    address,
    cep,
    city,
    state,
    neighborhood,
    complement,
    } = registerBodySchema.parse(request.body);
    
    try {
        
    } catch (error) {
        
    }
};
