import { Clinic, ClinicHealthInsurance, ClinicSpecialty, Prisma } from "@prisma/client";
import { ClinicsRepository } from "../clinics-repository";
import { randomNumberWithDigits } from "@/utils/random-number-generate";

export class InMemoryClinicsRepository implements ClinicsRepository {
  public items: Clinic[] = [];
  public specialtyItems: ClinicSpecialty[] = [];
  public healthInsuranceItems: ClinicHealthInsurance[] = [];

  async findByEmail(email: string): Promise<Clinic | null> {
    const clinic = this.items.find((item) => item.email === email);
    return clinic || null;
  }

  async findByCnpj(cnpj: string): Promise<Clinic | null> {
    const clinic = this.items.find((item) => item.cnpj === cnpj);
    return clinic || null;
  }

  async create(data: Prisma.ClinicCreateInput): Promise<Clinic> {
    const clinic = {
      id: randomNumberWithDigits(),
      name: data.name,
      phone: data.phone,
      cellPhone: data.cellPhone as string,
      whatsapp: data.whatsapp as string,
      hasNumber: data.hasNumber ?? true,
      houseNumber: data.houseNumber as string,
      acceptTerm: data.acceptTerm as boolean,
      email: data.email,
      cnpj: data.cnpj,
      password_hash: data.password_hash,
      isAuthenticated: data.isAuthenticated ?? false,
      address: data.address,
      cep: data.cep,
      city: data.city,
      state: data.state,
      neighborhood: data.neighborhood,
      complement: data.complement || null,
      createdAt: new Date(),
    } as Clinic;

    this.items.push(clinic);

    if (data.specialty && data.specialty.create) {
      const specialties = Array.isArray(data.specialty.create)
        ? data.specialty.create
        : [data.specialty.create];

      specialties.forEach(specialty => {
        const newSpecialty: ClinicSpecialty = {
          id: randomNumberWithDigits(),
          value: specialty.value,
          label: specialty.label,
          clinicId: clinic.id
        };

        this.specialtyItems.push(newSpecialty);
      });
    }

    if (data.healthInsurance && data.healthInsurance.create) {
      const insurances = Array.isArray(data.healthInsurance.create)
        ? data.healthInsurance.create
        : [data.healthInsurance.create];

      insurances.forEach(insurance => {
        const newInsurance: ClinicHealthInsurance = {
          id: randomNumberWithDigits(),
          value: insurance.value,
          label: insurance.label,
          clinicId: clinic.id
        };

        this.healthInsuranceItems.push(newInsurance);
      });
    }

    return clinic;
  }
}