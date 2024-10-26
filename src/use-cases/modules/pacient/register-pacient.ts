import { PacientsRepository } from "@/repositories/pacients-repository";
import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";
import { PacientAlreadyExistsError } from "@/use-cases/errors/pacient/pacient-already-exists-error";
import { hashPassword } from "@/utils/hash-password";
import { StringToDate } from "@/utils/string-to-date";
import { Pacient } from "@prisma/client";

interface IRegisterPacient {
  name: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  birth_date: string;
  cpf: string;
  gender: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  complement: string | null;
}

interface IRegisterPacientResponse {
  pacient: Pacient;
}

export class RegisterPacientUseCase {
  constructor(private pacientRepository: PacientsRepository) {}

  execute = async ({
    name,
    address,
    phone,
    email,
    password,
    birth_date,
    cpf,
    gender,
    cep,
    state,
    city,
    complement,
    neighborhood,
  }: IRegisterPacient): Promise<IRegisterPacientResponse> => {
    const password_hash = await hashPassword(password);

    const pacientWithSameEmail =
      await this.pacientRepository.findByEmail(email);

    if (pacientWithSameEmail) {
      throw new PacientAlreadyExistsError("Pacient e-mail already exists!");
    }

    const pacientWithSameCpf = await this.pacientRepository.findByCpf(cpf);

    if (pacientWithSameCpf) {
      throw new PacientAlreadyExistsError("Pacient CPF already exists!");
    }

    const birthDate = StringToDate(birth_date);

    if (!birthDate) {
      throw new InvalidDateError();
    }

    const pacient = await this.pacientRepository.create({
      name,
      address,
      phone,
      email,
      password_hash,
      birth_date: birthDate,
      cpf,
      gender,
      cep,
      state,
      city,
      complement,
      neighborhood,
    });

    return {
      pacient,
    };
  };
}
