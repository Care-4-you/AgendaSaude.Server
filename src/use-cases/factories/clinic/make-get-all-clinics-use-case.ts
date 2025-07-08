import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { GetAllClinicsUseCase } from "@/use-cases/modules/clinic/getAllClinics";

export function makeGetAllClinicsUseCase() {
  const clinicsRepository = new PrismaClinicsRepository();
  return new GetAllClinicsUseCase(clinicsRepository);
}
