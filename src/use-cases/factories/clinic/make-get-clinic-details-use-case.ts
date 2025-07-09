import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository";
import { GetClinicDetailsUseCase } from "../../modules/clinic/getClinicDetails";

export const makeGetClinicDetailsUseCase = () => {
  const prismaClinicsRepository = new PrismaClinicsRepository();

  const getClinicDetailsUseCase = new GetClinicDetailsUseCase(
    prismaClinicsRepository,
  );

  return getClinicDetailsUseCase;
};
