import { Pacient, Prisma } from "@prisma/client";
import { PacientsRepository } from "../pacients-repository";
import { prisma } from "@/lib/prisma";

export class PrismaPacientsRepository implements PacientsRepository {
  async findById(id: number): Promise<Pacient | null> {
    const pacient = await prisma.pacient.findUnique({
      where: { id },
    });

    return pacient;
  }

  async findByEmail(email: string): Promise<Pacient | null> {
    const pacient = await prisma.pacient.findUnique({
      where: { email },
    });

    return pacient;
  }

  async findByCpf(cpf: string): Promise<Pacient | null> {
    const pacient = await prisma.pacient.findUnique({
      where: { cpf },
    });

    return pacient;
  }

  async create(data: Prisma.PacientCreateInput): Promise<Pacient> {
    const pacient = await prisma.pacient.create({ data });

    return pacient;
  }

  async save(pacient: Pacient): Promise<Pacient> {
    const { id, ...pacientData } = pacient;
    
    const savePacient = await prisma.pacient.update({
      where: { id },
      data: pacientData as Prisma.PacientUpdateInput,
    });

    return savePacient;
  }
}
