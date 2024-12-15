import { PrismaMedicsRepository } from "@/repositories/prisma/prisma-medics-repositort";

export const makeMedicUseCase = () => {
  const prismaMedicRepository = new PrismaMedicsRepository();
};
