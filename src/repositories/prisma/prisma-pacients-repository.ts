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

  async create(data: Prisma.PacientCreateInput): Promise<Pacient> {
    const pacient = await prisma.pacient.create({ data });

    return pacient;
  }

  async save(pacient: Pacient): Promise<Pacient> {
    const savePacient = await prisma.pacient.update({
      where: { id: pacient.id },
      data: pacient,
    });

    return savePacient;
  }
}
