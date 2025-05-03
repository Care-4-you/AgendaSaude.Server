import { Pacient, Prisma } from "@prisma/client";
import { PacientsRepository } from "../pacients-repository";
import { randomNumberWithDigits } from "@/utils/random-number-generate";

export class InMemoryPacientsRepository implements PacientsRepository {
  public items: Pacient[] = [];

  async findById(id: number): Promise<Pacient | null> {
    return this.items.find(item => item.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<Pacient | null> {
    return this.items.find(item => item.email === email) ?? null;
  }

  async findByCpf(cpf: string): Promise<Pacient | null> {
    return this.items.find(item => item.cpf === cpf) ?? null;
  }

  async create(data: Prisma.PacientCreateInput): Promise<Pacient> {
    const pacient: Pacient = {
      id: randomNumberWithDigits(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      cellPhone: data.cellPhone,
      whatsapp: data.whatsapp,
      isWhatsapp: data.isWhatsapp ?? false,
      hasNumber: data.hasNumber ?? true,
      houseNumber: data.houseNumber,
      acceptTerm: data.acceptTerm,
      birth_date:
        typeof data.birth_date === "string"
          ? new Date(data.birth_date)
          : data.birth_date,
      cpf: data.cpf,
      gender: typeof data.gender === "string"
        ? JSON.parse(data.gender)
        : data.gender,
      password_hash: data.password_hash,
      address: data.address,
      cep: data.cep,
      city: data.city,
      neighborhood: data.neighborhood,
      state: data.state,
      complement: data.complement ?? null,
      isAuthenticated: false,
      created_at: new Date(),
    };

    this.items.push(pacient);
    return pacient;
  }

  async save(pacient: Pacient): Promise<Pacient> {
    const index = this.items.findIndex(item => item.id === pacient.id);
    if (index > -1) {
      this.items[index] = pacient;
    }
    return pacient;
  }
}
