import { Pacient, Prisma } from "@prisma/client";
import { PacientsRepository } from "../pacients-repository";
import { randomNumberWithDigits } from "@/utils/random-number-generate";

export class InMemoryPacientsRepository implements PacientsRepository {
  public items: Pacient[] = [];

  async findById(id: number): Promise<Pacient | null> {
    const pacient = this.items.find((item) => item.id === id);

    if (!pacient) {
      return null;
    }

    return pacient;
  }

  async findByEmail(email: string): Promise<Pacient | null> {
    const pacient = this.items.find((item) => item.email === email);

    if (!pacient) {
      return null;
    }

    return pacient;
  }

  async create(data: Prisma.PacientCreateInput): Promise<Pacient> {
    const pacient: Pacient = {
      id: randomNumberWithDigits(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      birth_date:
        typeof data.birth_date === "string"
          ? new Date(data.birth_date)
          : data.birth_date,
      cpf: data.cpf,
      gender: data.gender,
      password_hash: data.password_hash,
      address: data.address,
      cep: data.cep,
      city: data.city,
      neighborhood: data.neighborhood,
      state: data.state,
      complement: data.complement ?? "",
      created_at: new Date(),
    };

    this.items.push(pacient);

    return pacient;
  }

  async save(pacient: Pacient): Promise<Pacient> {
    const pacientIndex = this.items.findIndex((item) => item.id === pacient.id);

    if (pacientIndex >= 0) {
      this.items[pacientIndex] = pacient;
    }

    return pacient;
  }
}
