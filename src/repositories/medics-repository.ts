import { Prisma, Medic } from "@prisma/client";

export interface ClinicsRepository {
  findById(id: number): Promise<Medic | null>;

  findByEmail(email: string): Promise<Medic | null>;

  findByCnpj(cnpj: string): Promise<Medic | null>;

  create(data: Prisma.ClinicCreateInput): Promise<Medic>;

  findByIdWithDetails(id: number): Promise<Medic | null>;

  findAllWithDetails(): Promise<any[]>;
}
