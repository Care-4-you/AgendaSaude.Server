import { PrismaClinicsRepository } from "@/repositories/prisma/prisma-clinics-repository"
import { RegisterClinicUseCase } from "../modules/clinic/registerClinic";

export const makeClinicUseCase = () => {
    const prismaClinicsRepository = new PrismaClinicsRepository();

    const registerClinicUseCase = new RegisterClinicUseCase(prismaClinicsRepository);

    return registerClinicUseCase;
}