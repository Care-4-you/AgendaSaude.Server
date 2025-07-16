import { Prisma, Medic } from "@prisma/client";

export interface MedicsRepository {
  create(data: Prisma.MedicCreateInput): Promise<Medic>;
  findByCrmNumberAndState(number: string, state: string): Promise<Medic | null>;
}
