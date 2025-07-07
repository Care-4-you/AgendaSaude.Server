import { ClinicsRepository } from "@/repositories/clinics-repository";

interface IGetClinicDetailsRequest {
  id: number;
}

interface IGetClinicDetailsResponse {
  clinic: any | null;
}

export class GetClinicDetailsUseCase {
  constructor(private clinicsRepository: ClinicsRepository) { }

  execute = async ({
    id,
  }: IGetClinicDetailsRequest): Promise<IGetClinicDetailsResponse> => {
    const clinic = await this.clinicsRepository.findByIdWithDetails(id);

    return {
      clinic,
    };
  };
}
