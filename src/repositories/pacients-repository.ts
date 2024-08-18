import { Pacient, Prisma } from "@prisma/client";

export interface PacientsRepository {
  findById(id: number): Promise<Pacient | null>;

  findByEmail(email: string): Promise<Pacient | null>;

  create(data: Prisma.PacientCreateInput): Promise<Pacient>;

  save(pacient: Pacient): Promise<Pacient>;
}
