import { Medic } from "@prisma/client";
import { MedicsRepository } from "@/repositories/medics-repository";
import { hashPassword } from "@/utils/hash-password";

import { InvalidCrmFormatError } from "@/use-cases/errors/medic/medic-crm-error";

interface IRegisterMedicFromFront {
  name: string;
  phone: string;
  whatsapp: string;
  cellPhone: string;
  councils: { value: string; label: string };
  councilsUF: { value: string; label: string };
  councilsNumber: string;
  gender: { value: string; label: string };
  specialty: { value: string; label: string };
  email: string;
  password: string;
  passwordConfirmation: string;
  acceptTerm: boolean;
  isWhatsapp: boolean;
  city?: string;
  state?: string;
}

interface IRegisterMedicResponse {
  medic: Medic;
}

export class RegisterMedicUseCase {
  private static readonly STATE_PATTERN = /^[A-Z]{2}$/;

  constructor(private medicsRepository: MedicsRepository) { }

  async execute(data: IRegisterMedicFromFront): Promise<IRegisterMedicResponse> {
    // Normalizar números para só dígitos
    data.phone = this.normalizePhone(data.phone);
    data.whatsapp = this.normalizePhone(data.whatsapp);
    data.cellPhone = this.normalizePhone(data.cellPhone);
    data.councilsNumber = data.councilsNumber.trim();

    this.validateRequiredFields(data);
    this.validatePasswordConfirmation(data.password, data.passwordConfirmation);
    if (!data.acceptTerm) {
      throw new Error("Você deve aceitar os termos");
    }

    const crmNormalized = this.normalizeAndValidateCrm([
      { number: data.councilsNumber, state: data.councilsUF.value },
    ]);

    const password_hash = await hashPassword(data.password);

    const medic = await this.medicsRepository.create({
      name: data.name.trim(),
      phone: data.phone,
      whatsapp: data.whatsapp,
      cellPhone: data.cellPhone,
      email: data.email.trim(),
      password_hash,
      gender: data.gender.value.trim(),
      isAuthenticated: false,
      isWhatsapp: data.isWhatsapp,
      photo: null,
      specialty: {
        create: [{ specialty: data.specialty.value.trim() }],
      },
      crm: {
        create: crmNormalized,
      },
      city: data.city?.trim() ?? null,
      state: data.state?.trim() ?? null,
    });

    return { medic };
  }

  private normalizePhone(phone: string): string {
    // Remove tudo que não seja número, exemplo: "(31) 90871-9969" vira "31908719969"
    return phone.replace(/\D/g, "");
  }

  private validateRequiredFields(data: IRegisterMedicFromFront) {
    if (!data.name?.trim()) throw new Error("Nome é obrigatório");

    // Agora phone, whatsapp e cellPhone devem ser só dígitos após normalização
    if (!data.phone || !/^\d+$/.test(data.phone))
      throw new Error("Telefone inválido, deve conter apenas números");
    if (!data.whatsapp || !/^\d+$/.test(data.whatsapp))
      throw new Error("WhatsApp inválido, deve conter apenas números");
    if (!data.cellPhone || !/^\d+$/.test(data.cellPhone))
      throw new Error("Celular inválido, deve conter apenas números");

    if (!data.email?.trim()) throw new Error("Email é obrigatório");
    if (!data.password?.trim()) throw new Error("Senha é obrigatória");
    if (!data.passwordConfirmation?.trim())
      throw new Error("Confirmação de senha é obrigatória");
    if (!data.councilsNumber?.trim())
      throw new Error("Número do conselho é obrigatório");
    if (!data.councilsUF?.value?.trim())
      throw new Error("UF do conselho é obrigatório");
    if (!data.gender?.value?.trim()) throw new Error("Gênero é obrigatório");
    if (!data.specialty?.value?.trim())
      throw new Error("Especialidade é obrigatória");

    // councilsNumber só dígitos
    if (!/^\d+$/.test(data.councilsNumber)) {
      throw new InvalidCrmFormatError(
        data.councilsNumber,
        data.councilsUF.value
      );
    }
  }

  private validatePasswordConfirmation(password: string, confirmation: string) {
    if (password !== confirmation) {
      throw new Error("Senha e confirmação de senha não coincidem");
    }
  }

  private normalizeAndValidateCrm(
    crm: { number: string; state: string }[]
  ): { number: string; state: string }[] {
    return crm.map((item) => {
      const number = item.number.trim();
      const state = item.state.trim().toUpperCase();

      if (!RegisterMedicUseCase.STATE_PATTERN.test(state)) {
        throw new InvalidCrmFormatError(number, state);
      }

      return { number, state };
    });
  }

}
