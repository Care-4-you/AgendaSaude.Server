import { ClinicsRepository } from "@/repositories/clinics-repository";
import { ClinicAlreadyExistsError } from "@/use-cases/errors/clinic/clinic-already-exist-error";
import { hashPassword } from "@/utils/hash-password";
import { Clinic } from "@prisma/client";

interface IRegisterClinic {
  name: string;
  specialty: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  complement: string | null;
}

interface IRegisterClinicResponse {
  clinic: Clinic;
}

export class RegisterClinicUseCase {
  constructor(private clinicsRepository: ClinicsRepository) {}

  execute = async ({
    name,
    specialty,
    phone,
    email,
    password,
    address,
    cep,
    city,
    state,
    neighborhood,
    complement,
  }: IRegisterClinic): Promise<IRegisterClinicResponse> => {
    const password_hash = await hashPassword(password);

    const clinicWithSameEmail = await this.clinicsRepository.findByEmail(email);

    if (clinicWithSameEmail) {
      throw new ClinicAlreadyExistsError();
    }

    const clinic = await this.clinicsRepository.create({
      name,
      specialty,
      phone,
      email,
      password_hash,
      address,
      cep,
      city,
      state,
      neighborhood,
      complement,
    });

    return {
      clinic,
    };
  };
}
