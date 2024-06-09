import { Prisma, Clinic } from "@prisma/client";
import { ClinicsRepository } from "../clinics-repository";
import { prisma } from "@/lib/prisma";

export class PrismaClinicsRepository implements ClinicsRepository {
  // async findById(id: number) {
  //   const clinic = await prisma.clinic.findFirst({
  //     where: {
  //       id,
  //     },
  //   });
  // }

  async findByEmail(email: string) {
    const clinic = await prisma.clinic.findUnique({
      where: { email }
    })

    return clinic;
  }

  async create(data: Prisma.ClinicCreateInput): Promise<Clinic> {
    const clinic = await prisma.clinic.create({
      data,
    });

    return clinic;
  }
}
