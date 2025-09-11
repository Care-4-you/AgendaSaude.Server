import { ClinicsRepository } from "@/repositories/clinics-repository";
import { ClinicAlreadyExistsError } from "@/use-cases/errors/clinic/clinic-already-exist-error";
import { hashPassword } from "@/utils/hash-password";
import { Clinic } from "@prisma/client";

interface IRegisterClinic {
  name: string;
  healthInsurance: {
    value: string;
    label: string;
  }[];
  phone: string;
  cellPhone: string;
  whatsapp: string;
  hasNumber: boolean;
  houseNumber: string;
  acceptTerm: boolean;
  email: string;
  cnpj: string;
  password: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  complement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

interface IRegisterClinicResponse {
  clinic: Clinic;
}

export class RegisterClinicUseCase {
  constructor(private clinicsRepository: ClinicsRepository) {}

  execute = async ({
    name,
    healthInsurance,
    phone,
    cellPhone,
    whatsapp,
    hasNumber,
    houseNumber,
    acceptTerm,
    email,
    cnpj,
    password,
    address,
    cep,
    city,
    state,
    neighborhood,
    complement,
    latitude,
    longitude
  }: IRegisterClinic): Promise<IRegisterClinicResponse> => {
    const password_hash = await hashPassword(password);

    const clinicWithSameEmail = await this.clinicsRepository.findByEmail(email);

    if (clinicWithSameEmail) {
      throw new ClinicAlreadyExistsError();
    }

    const clinicWithSameCnpj = await this.clinicsRepository.findByCnpj(cnpj);

    if (clinicWithSameCnpj) {
      throw new ClinicAlreadyExistsError();
    }

    const clinic = await this.clinicsRepository.create({
      name,
      healthInsurance: {
        create: healthInsurance
      },
      phone,
      cellPhone,
      whatsapp,
      hasNumber,
      houseNumber,
      acceptTerm,
      email,
      cnpj,
      password_hash,
      address,
      cep,
      city,
      state,
      neighborhood,
      complement,
      isAuthenticated: false,
      latitude,
      longitude
    });

    return {
      clinic,
    };
  };
}
