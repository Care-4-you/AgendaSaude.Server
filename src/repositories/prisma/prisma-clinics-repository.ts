import { Prisma, Clinic } from "@prisma/client";
import { ClinicsRepository } from "../clinics-repository";
import { prisma } from "@/lib/prisma";
import { geocodeAddress } from "@/utils/geocoding/nominatim-service";

export class PrismaClinicsRepository implements ClinicsRepository {
  async findById(id: number): Promise<Clinic | null> {
    const clinic = await prisma.clinic.findUnique({
      where: { id },
    });

    return clinic;
  }

  async findByEmail(email: string) {
    const clinic = await prisma.clinic.findUnique({
      where: { email },
    });

    return clinic;
  }

  async findByCnpj(cnpj: string): Promise<Clinic | null> {
    const clinic = await prisma.clinic.findUnique({
      where: { cnpj },
    });

    return clinic;
  }

  async create(data: Prisma.ClinicCreateInput): Promise<Clinic> {
    try {
      const { latitude, longitude } = await geocodeAddress({
        address: data.address,
        cep: data.cep,
        city: data.city,
        state: data.state,
        neighborhood: data.neighborhood,
        houseNumber: data.houseNumber as string
      });

      const clinic = await prisma.clinic.create({
        data: {
          ...data,
          latitude,
          longitude
        },
      });

      return clinic;
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
      // Fallback: criar a clínica sem coordenadas se a geocodificação falhar
      const clinic = await prisma.clinic.create({
        data,
      });
      return clinic;
    }
  }

  async findByIdWithDetails(id: number) {
    const clinic = await prisma.clinic.findUnique({
      where: { id },
      include: {
        specialty: {
          select: {
            id: true,
            value: true,
            label: true,
          },
        },
        healthInsurance: {
          select: {
            id: true,
            value: true,
            label: true,
          },
        },
      },
    });

    return clinic;
  }

  async findAllWithDetails() {
    return prisma.clinic.findMany({
      include: {
        specialty: { select: { id: true, value: true, label: true } },
        healthInsurance: { select: { id: true, value: true, label: true } },
      },
    });
  }
}
