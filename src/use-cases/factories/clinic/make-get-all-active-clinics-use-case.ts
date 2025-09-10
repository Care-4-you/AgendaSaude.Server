import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { GetAllClinicsUseCase } from "@/use-cases/modules/clinic/getAllActiveClinics";

export function makeGetAllActivateClinicsUseCase() {
  const clinicsRepository = new PrismaClinicsRepository();
  return new GetAllClinicsUseCase(clinicsRepository);
}
