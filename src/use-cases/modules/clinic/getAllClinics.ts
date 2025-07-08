import { ClinicsRepository } from "@/repositories/clinics-repository";

export class GetAllClinicsUseCase {
  constructor(private clinicsRepository: ClinicsRepository) { }

  async execute() {
    const clinics = await this.clinicsRepository.findAllWithDetails();
    // Remove campos sensíveis
    return clinics.map((clinic: any) => {
      const {
        password_hash,
        isAuthenticated,
        ...safeClinic
      } = clinic;
      return safeClinic;
    });
  }
}
