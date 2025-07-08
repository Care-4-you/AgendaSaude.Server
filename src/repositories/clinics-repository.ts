import { Prisma, Clinic } from "@prisma/client";

export interface ClinicsRepository {
  findById(id: number): Promise<Clinic | null>;

  findByEmail(email: string): Promise<Clinic | null>;

  findByCnpj(cnpj: string): Promise<Clinic | null>;

  create(data: Prisma.ClinicCreateInput): Promise<Clinic>;

  findByIdWithDetails(id: number): Promise<Clinic | null>;

  findAllWithDetails(): Promise<any[]>;
}
