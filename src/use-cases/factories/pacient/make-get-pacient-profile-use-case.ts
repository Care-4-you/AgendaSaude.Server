import { PrismaPacientsRepository } from "@/repositories/prisma/prisma-pacients-repository";
import { GetPacientProfileUseCase } from "@/use-cases/modules/pacient/get-pacient-profile";

export const makeGetPacientProfileUseCase = () => {
  const prismaPacientsRepository = new PrismaPacientsRepository();
  const useCase = new GetPacientProfileUseCase(prismaPacientsRepository);

  return useCase;
};
