import { MedicsRepository } from "@/repositories/medics-repository";
import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";
import { MedicAlreadyExistsError } from "@/use-cases/errors/medic/medic-already-exists-error";
import { hashPassword } from "@/utils/hash-password";
import { StringToDate } from "@/utils/string-to-date";
import { Medic } from "@prisma/client";

interface IRegisterMedic {
  name: string;
  cpf: string;
  phone: string;
  email: string;
  gender: string;
  city: string;
  state: string;
  password: string;
  specialty: string;
  crm: string;
  clinicId: number;
}

interface IRegisterMedicResponse {
  medic: Medic;
}

export class RegisterMedicUseCase {
  constructor(private medicRepository: MedicsRepository) {}

  execute = async ({
    name,
    phone,
    email,
    cpf,
    gender,
    state,
    city,
    password,
    crm,
    specialty,
    clinicId,
  }: IRegisterMedic): Promise<IRegisterMedicResponse> => {
    const password_hash = await hashPassword(password);

    const medicWithSameEmail = await this.medicRepository.findByEmail(email);

    if (medicWithSameEmail) {
      throw new MedicAlreadyExistsError(
        "Medic with same email already exists!",
      );
    }

    const medicWithSameCpf = await this.medicRepository.findByCpf(cpf);

    if (medicWithSameCpf) {
      throw new MedicAlreadyExistsError("Medic with same CPF already exists!");
    }

    const medicWithSameCrm = await this.medicRepository.findByCrm(crm);

    if (medicWithSameCrm) {
      throw new MedicAlreadyExistsError("Medic with same CRM already exists!");
    }

    const medic = await this.medicRepository.create({
      name,
      email,
      cpf,
      phone,
      gender,
      state,
      city,
    });

    // const medic = await this.medicRepository.create({
    //   name,
    //   address,
    //   phone,
    //   email,
    //   password_hash,
    //   birth_date: birthDate,
    //   cpf,
    //   gender,
    //   cep,
    //   state,
    //   city,
    //   complement,
    //   neighborhood,
    // });

    return {
      medic,
    };
  };
}
