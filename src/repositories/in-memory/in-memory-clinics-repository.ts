import { Clinic, Prisma } from "@prisma/client";
import { ClinicsRepository } from "../clinics-repository";
import { randomNumberWithDigits } from "@/utils/random-number-generate";

export class InMemoryClinicsRepository implements ClinicsRepository {
  public items: Clinic[] = [];

  async findByEmail(email: string): Promise<Clinic | null> {
    const clinic = this.items.find((item) => item.email === email);

    if (!clinic) {
      return null;
    }

    return clinic;
  }

  async create(data: Prisma.ClinicCreateInput): Promise<Clinic> {
    const clinic: Clinic = {
      id: randomNumberWithDigits(),
      name: data.name,
      specialty: data.specialty,
      email: data.email,
      phone: data.phone,
      password_hash: data.password_hash,
      address: data.address,
      cep: data.cep,
      city: data.city,
      neighborhood: data.neighborhood,
      state: data.state,
      complement: data.complement === undefined ? "" : data.complement,
      created_at: new Date(),
    };
      
      this.items.push(clinic);

      return clinic;
  }
}
