import { PrismaMedicsRepository } from "@/repositories/prisma/prisma-medics-repository";
import { RegisterMedicUseCase } from "@/use-cases/modules/medic/registerMedic";

export const makeMedicsUseCase = () => {
  const prismaMedicsRepository = new PrismaMedicsRepository();

  const registerMedicsUseCase = new RegisterMedicUseCase(
    prismaMedicsRepository,
  );

  return registerMedicsUseCase;
};
