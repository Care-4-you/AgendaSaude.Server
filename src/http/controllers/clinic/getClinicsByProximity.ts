import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeGetAllActivateClinicsUseCase } from "@/use-cases/factories/clinic/make-get-all-active-clinics-use-case";
import { geocodeAddress, GeocodingError } from "@/utils/geocoding/nominatim-service";
import { getDistance } from "geolib";
import { Clinic, ClinicHealthInsurance } from "@prisma/client";
import { prisma } from "@/lib/prisma";

interface AddressInput {
  address: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  houseNumber: string;
}

interface ClinicWithDistance {
  id: number;
  name: string;
  phone: string;
  cellPhone: string;
  whatsapp: string;
  hasNumber: boolean;
  houseNumber: string;
  email: string;
  cnpj: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  neighborhood: string;
  complement: string | null;
  latitude: number;
  longitude: number;
  createdAt: Date;
  healthInsurance: ClinicHealthInsurance[];
  distanceInKm: number;
}

export const getClinicsByProximity = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const getClinicsByProximitySchema = z.object({
    address: z.string().min(1, "Endereço é obrigatório"),
    cep: z.string().min(8, "CEP deve ter pelo menos 8 caracteres"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
    neighborhood: z.string().min(1, "Bairro é obrigatório"),
    houseNumber: z.string().min(1, "Número da casa é obrigatório"),
    radiusInKm: z.number().min(0.1).max(60, "Raio deve estar entre 0.1 e 60 km"),
  });

  try {
    const {
      address,
      cep,
      city,
      state,
      neighborhood,
      houseNumber,
      radiusInKm,
    } = getClinicsByProximitySchema.parse(request.body);

    // Geocodificar o endereço fornecido pelo paciente
    const addressInput: AddressInput = {
      address,
      cep,
      city,
      state,
      neighborhood,
      houseNumber,
    };

    let patientCoordinates;
    try {
      patientCoordinates = await geocodeAddress(addressInput);
    } catch (error) {
      if (error instanceof GeocodingError) {
        return reply.status(400).send({
          message: "Não foi possível encontrar coordenadas para o endereço fornecido.",
          error: error.message,
        });
      }
      throw error;
    }

    // Buscar todas as clínicas ativas
    const clinics = await prisma.clinic.findMany({
      where: {
        isAuthenticated: true,
      },
      include: {
        healthInsurance: true,
      },
    });

    // Filtrar clínicas que têm coordenadas e calcular distâncias
    const clinicsWithDistance: ClinicWithDistance[] = [];

    for (const clinic of clinics) {
      // Pular clínicas sem coordenadas
      if (!clinic.latitude || !clinic.longitude) {
        continue;
      }

      // Calcular distância usando geolib
      const distanceInMeters = getDistance(
        {
          latitude: patientCoordinates.latitude,
          longitude: patientCoordinates.longitude,
        },
        {
          latitude: clinic.latitude,
          longitude: clinic.longitude,
        }
      );

      const distanceInKm = distanceInMeters / 1000;

      // Filtrar apenas clínicas dentro do raio especificado
      if (distanceInKm <= radiusInKm) {
        clinicsWithDistance.push({
          id: clinic.id,
          name: clinic.name,
          phone: clinic.phone,
          cellPhone: clinic.cellPhone,
          whatsapp: clinic.whatsapp,
          hasNumber: clinic.hasNumber,
          houseNumber: clinic.houseNumber,
          email: clinic.email,
          cnpj: clinic.cnpj,
          address: clinic.address,
          cep: clinic.cep,
          city: clinic.city,
          state: clinic.state,
          neighborhood: clinic.neighborhood,
          complement: clinic.complement,
          latitude: clinic.latitude,
          longitude: clinic.longitude,
          createdAt: clinic.createdAt,
          healthInsurance: clinic.healthInsurance,
          distanceInKm: Math.round(distanceInKm * 100) / 100, // Arredondar para 2 casas decimais
        });
      }
    }

    // Ordenar por distância (mais próximo primeiro)
    clinicsWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm);

    return reply.status(200).send({
      message: `${clinicsWithDistance.length} clínicas encontradas em um raio de ${radiusInKm}km.`,
      data: {
        patientCoordinates,
        searchRadius: radiusInKm,
        totalFound: clinicsWithDistance.length,
        clinics: clinicsWithDistance,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        message: "Dados de entrada inválidos.",
        errors: error.errors,
      });
    }

    console.error("Erro ao buscar clínicas por proximidade:", error);
    return reply.status(500).send({
      message: "Erro interno do servidor.",
    });
  }
};