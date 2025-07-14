import { Prisma, Medic } from "@prisma/client";

export interface MedicsRepository {
  findById(id: number): Promise<Medic | null>;

  findByEmail(email: string): Promise<Medic | null>;

  findByCpf(cpf: string): Promise<Medic | null>;

  create(data: Prisma.MedicCreateInput): Promise<Medic>;

  findByCrmNumberAndState(number: string, state: string): Promise<Medic | null>; 
}
