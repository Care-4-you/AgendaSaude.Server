import { Medic, Prisma } from "@prisma/client";

export interface MedicsRepository {
  findById(id: number): Promise<Medic | null>;

  findByEmail(email: string): Promise<Medic | null>;

  findByCpf(cpf: string): Promise<Medic | null>;

  findByCrm(crm: string): Promise<Medic | null>;

  create(data: Prisma.MedicCreateInput): Promise<Medic>;

  save(Medic: Medic): Promise<Medic>;
}
