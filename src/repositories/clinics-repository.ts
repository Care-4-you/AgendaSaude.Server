import { Prisma, Clinic } from "@prisma/client";

export interface ClinicsRepository {
  findByEmail(email: string): Promise<Clinic | null>;

  create(data: Prisma.ClinicCreateInput): Promise<Clinic>;
}
