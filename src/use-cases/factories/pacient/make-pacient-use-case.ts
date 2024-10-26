import { PrismaPacientsRepository } from "@/repositories/prisma/prisma-pacients-repository";
import { RegisterPacientUseCase } from "@/use-cases/modules/pacient/register-pacient";

export const makePacientUseCase = () => {
  const prismaPacientsRepository = new PrismaPacientsRepository();

  const useCase = new RegisterPacientUseCase(prismaPacientsRepository);

  return useCase;
};
