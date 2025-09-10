import { Prisma, Medic } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MedicsRepository } from "../medics-repository";

export class PrismaMedicsRepository implements MedicsRepository {
  async findById(id: number): Promise<Medic | null> {
    return await prisma.medic.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<Medic | null> {
    return await prisma.medic.findFirst({
      where: { email },
    });
  }

  async findByCpf(cpf: string): Promise<Medic | null> {
    return await prisma.medic.findUnique({
      where: { cpf },
    });
  }

  async findByCrm(crm: string): Promise<Medic | null> {
    return await prisma.medic.findFirst({
      where: {
        crm: {
          some: {
            number: crm,
          },
        },
      },
      include: {
        crm: true,
      },
    });
  }

  async findByCrmNumberAndState(number: string, state: string) {
    return prisma.medic.findFirst({
      where: {
        crm: {
          some: {
            number,
            state,
          },
        },
      },
    });
  }

  async create(data: Prisma.MedicCreateInput): Promise<Medic> {
    const medic = await prisma.medic.create({
      data,
      include: {
        clinic: true,
        specialty: true,
        crm: true,
      },
    });

    return medic;
  }

  async save(medic: Medic): Promise<Medic> {
    return await prisma.medic.update({
      where: { id: medic.id },
      data: medic,
    });
  }
}
