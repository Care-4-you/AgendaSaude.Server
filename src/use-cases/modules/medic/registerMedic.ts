import { MedicsRepository } from "@/repositories/medics-repository";
import { hashPassword } from "@/utils/hash-password";
import { Medic } from "@prisma/client";
import { MedicAlreadyExistsError, MedicCrmAlreadyExistsError } from "@/use-cases/errors/medic/medic-already-exists-error";
import { MaxCrmExceededError, DuplicateCrmInRequestError, InvalidCrmFormatError } from "@/use-cases/errors/medic/medic-crm-error";

interface IRegisterMedic {
  name: string;
  cpf: string;
  phone: string;
  whatsapp: string;
  email: string;
  password: string;
  gender: string;
  city: string;
  state: string;
  photo?: string | null;
  specialty: string[];
  crm: { number: string; state: string }[];
  clinicId: number | null;
}

interface IRegisterMedicResponse {
  medic: Medic;
}

export class RegisterMedicUseCase {
  private static readonly MAX_CRM_COUNT = 2;
  private static readonly CRM_PATTERN = /^\d{4,6}$/; // CRM geralmente tem 4-6 dígitos
  private static readonly STATE_PATTERN = /^[A-Z]{2}$/;

  constructor(private medicsRepository: MedicsRepository) { }

  async execute({
    name,
    cpf,
    phone,
    whatsapp,
    email,
    password,
    gender,
    city,
    state,
    photo,
    specialty,
    crm,
    clinicId,
  }: IRegisterMedic): Promise<IRegisterMedicResponse> {
    // 1. Validações básicas de entrada
    this.validateRequiredFields({ name, cpf, phone, email, password, crm });

    // 2. Valida quantidade máxima de CRMs
    if (crm.length > RegisterMedicUseCase.MAX_CRM_COUNT) {
      throw new MaxCrmExceededError(RegisterMedicUseCase.MAX_CRM_COUNT);
    }

    if (crm.length === 0) {
      throw new InvalidCrmFormatError();
    }

    // 3. Normaliza e valida formato dos CRMs
    const normalizedCrm = this.normalizeAndValidateCrm(crm);

    // 4. Verifica CRMs duplicados no próprio array enviado
    this.checkDuplicateCrmsInRequest(normalizedCrm);

    // 5. Criptografa senha
    const password_hash = await hashPassword(password);

    // 6. Verifica se email já existe
    const medicWithSameEmail = await this.medicsRepository.findByEmail(email);
    if (medicWithSameEmail) {
      throw new MedicAlreadyExistsError('email');
    }

    // 7. Verifica se CPF já existe
    const medicWithSameCpf = await this.medicsRepository.findByCpf(cpf);
    if (medicWithSameCpf) {
      throw new MedicAlreadyExistsError('cpf');
    }

    // 8. Verifica CRM duplicado no banco (número + estado)
    await this.checkExistingCrmsInDatabase(normalizedCrm);

    // 9. Cria o médico no banco
    const medic = await this.medicsRepository.create({
      name,
      cpf,
      phone,
      whatsapp,
      email,
      password_hash,
      gender,
      city,
      state,
      isAuthenticated: false,
      isWhatsapp: false,
      photo: photo || null,
      clinic: clinicId
        ? {
          connect: { id: clinicId },
        }
        : undefined,
      specialty: {
        create: specialty.map((s) => ({ specialty: s })),
      },
      crm: {
        create: normalizedCrm,
      },
    });

    return { medic };
  }

  private validateRequiredFields(fields: {
    name: string;
    cpf: string;
    phone: string;
    email: string;
    password: string;
    crm: { number: string; state: string }[];
  }): void {
    const { name, cpf, phone, email, password, crm } = fields;

    if (!name?.trim()) {
      throw new Error('Name is required');
    }

    if (!cpf?.trim()) {
      throw new Error('CPF is required');
    }

    if (!phone?.trim()) {
      throw new Error('Phone is required');
    }

    if (!email?.trim()) {
      throw new Error('Email is required');
    }

    if (!password?.trim()) {
      throw new Error('Password is required');
    }

    if (!crm || !Array.isArray(crm)) {
      throw new Error('CRM data is required');
    }
  }

  private normalizeAndValidateCrm(crm: { number: string; state: string }[]): { number: string; state: string }[] {
    return crm.map((crmItem) => {
      const normalizedNumber = crmItem.number?.trim();
      const normalizedState = crmItem.state?.trim().toUpperCase();

      // Valida formato do número do CRM
      if (!normalizedNumber || !RegisterMedicUseCase.CRM_PATTERN.test(normalizedNumber)) {
        throw new InvalidCrmFormatError(normalizedNumber, normalizedState);
      }

      // Valida formato do estado (2 letras maiúsculas)
      if (!normalizedState || !RegisterMedicUseCase.STATE_PATTERN.test(normalizedState)) {
        throw new InvalidCrmFormatError(normalizedNumber, normalizedState);
      }

      return {
        number: normalizedNumber,
        state: normalizedState
      };
    });
  }

  private checkDuplicateCrmsInRequest(crm: { number: string; state: string }[]): void {
    const crmSet = new Set<string>();

    for (const crmItem of crm) {
      const key = `${crmItem.number}-${crmItem.state}`;

      if (crmSet.has(key)) {
        throw new DuplicateCrmInRequestError(crmItem.number, crmItem.state);
      }

      crmSet.add(key);
    }
  }

  private async checkExistingCrmsInDatabase(crm: { number: string; state: string }[]): Promise<void> {
    for (const crmItem of crm) {
      const crmExists = await this.medicsRepository.findByCrmNumberAndState(
        crmItem.number,
        crmItem.state
      );

      if (crmExists) {
        throw new MedicCrmAlreadyExistsError(crmItem.number, crmItem.state);
      }
    }
  }
}