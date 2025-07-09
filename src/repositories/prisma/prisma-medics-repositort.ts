import { Medic, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { MedicsRepository } from "../medics-repository";
import { MedicInformations } from "@/utils/interfaces/Medic-datas-interfaces";

export class PrismaMedicsRepository implements MedicsRepository {
  async findById(id: number): Promise<Medic | null> {
    const medic = await prisma.medic.findUnique({
      where: { id },
    });

    return medic;
  }

  async findByEmail(email: string): Promise<Medic | null> {
    const medic = await prisma.medic.findUnique({
      where: { email },
    });

    return medic;
  }

  async findByCpf(cpf: string): Promise<Medic | null> {
    const medic = await prisma.medic.findUnique({
      where: { cpf },
    });

    return medic;
  }

  async findByCrm(crm: string): Promise<Medic | null> {
    const medic = await prisma.medic.findFirst({
      where: {
        crm: {
          some: {
            // Condição para verificar se existe um CRM associado
            number: crm,
          },
        },
      },
      include: {
        crm: true, // Inclui os CRMs associados
      },
    });

    return medic;
  }

  async create(data: MedicInformations, clinicId: number): Promise<Medic> {
    const medic = await prisma.medic.create({
      data: {
        ...data,
        clinic: {
          connect: {
            id: clinicId,
          },
        },
      },
      include: {
        clinic: true,
        crm: true,
        specialty: true,
      },
    });

    return medic;
  }

  async save(medic: Medic): Promise<Medic> {
    const saveMedic = await prisma.medic.update({
      where: { id: medic.id },
      data: medic,
    });

    return saveMedic;
  }
}
