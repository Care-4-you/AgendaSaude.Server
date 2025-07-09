import { PacientsRepository } from "@/repositories/pacients-repository";
import { InvalidDateError } from "@/use-cases/errors/invalid-date-error";
import { PacientAlreadyExistsError } from "@/use-cases/errors/pacient/pacient-already-exists-error";
import { hashPassword } from "@/utils/hash-password";
import { StringToDate } from "@/utils/string-to-date";
import { Pacient } from "@prisma/client";

interface IRegisterPacient {
  name: string;
  phone: string;
  cellPhone: string;
  whatsapp: string;
  isWhatsapp: boolean;
  hasNumber: boolean;
  houseNumber: string;
  acceptTerm: boolean;

  email: string;
  password: string;
  birth_date: Date | string;
  cpf: string;
  gender: { value: string; label: string };
  address: string;
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
  constructor(private pacientRepository: PacientsRepository) { }

  execute = async ({
    name,
    phone,
    cellPhone,
    whatsapp,
    isWhatsapp,
    hasNumber,
    houseNumber,
    acceptTerm,
    email,
    password,
    birth_date,
    cpf,
    gender,
    address,
    cep,
    city,
    state,
    neighborhood,
    complement,
  }: IRegisterPacient): Promise<IRegisterPacientResponse> => {
    const password_hash = await hashPassword(password);

    const byEmail = await this.pacientRepository.findByEmail(email);
    if (byEmail) {
      throw new PacientAlreadyExistsError("Pacient e-mail already exists!");
    }

    const byCpf = await this.pacientRepository.findByCpf(cpf);
    if (byCpf) {
      throw new PacientAlreadyExistsError("Pacient CPF already exists!");
    }

    let birthDateObj: Date | null;
    if (birth_date instanceof Date) {
      birthDateObj = birth_date;
    } else {
      birthDateObj = StringToDate(birth_date);
    }
    if (!birthDateObj) {
      throw new InvalidDateError();
    }

    const pacient = await this.pacientRepository.create({
      name,
      phone,
      cellPhone,
      whatsapp,
      isWhatsapp,
      hasNumber,
      houseNumber,
      acceptTerm,
      email,
      password_hash,
      birth_date: birthDateObj,
      cpf,
      gender,    
      address,
      cep,
      city,
      state,
      neighborhood,
      complement,
    });

    return { pacient };
  };
}
