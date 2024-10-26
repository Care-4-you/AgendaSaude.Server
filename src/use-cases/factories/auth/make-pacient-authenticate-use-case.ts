import { PrismaPacientsRepository } from "@/repositories/prisma/prisma-pacients-repository";
import { PacientAuthenticateUseCase } from "@/use-cases/modules/auth/pacient-authenticate-use-case";

export const makePacientAuthenticateUseCase = () => {
  const prismaPacientRepository = new PrismaPacientsRepository();
  const useCase = new PacientAuthenticateUseCase(prismaPacientRepository);

  return useCase;
};
