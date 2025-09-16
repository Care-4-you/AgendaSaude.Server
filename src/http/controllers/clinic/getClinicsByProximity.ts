import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { geocodeAddress, GeocodingError } from "@/utils/geocoding/nominatim-service";
import { getDistance } from "geolib";
import { prisma } from "@/lib/prisma";
import { Clinic, Prisma } from "@prisma/client";

interface ClinicWithDistance extends Omit<Clinic, 'password_hash'> {
  fullAdress: string;
  distanceInKm: number;
  specialties: string[];
}

export const getClinicsByProximity = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const getClinicsByProximitySchema = z.object({
    address: z.string().min(1, "Endereço é obrigatório"),
    radiusInKm: z.number().min(0.1).max(60, "Raio deve estar entre 0.1 e 60 km"),
    specialties: z.array(z.string()).optional(),
  });

  try {
    const { address, radiusInKm, specialties: requestedSpecialties } = getClinicsByProximitySchema.parse(request.body);

    let patientCoordinates;
    try {
      patientCoordinates = await geocodeAddress(address);
    } catch (error) {
      if (error instanceof GeocodingError) {
        return reply.status(400).send({
          message: "Não foi possível encontrar coordenadas para o endereço fornecido.",
          error: error.message,
        });
      }
      throw error;
    }

    // Buscar todas as clínicas ativas com médicos ativos e especialidades
    // Usando select para excluir o passwordHash
    const clinics = await prisma.clinic.findMany({
      where: {
        isAuthenticated: true,
      },
      select: {
        id: true,
        name: true,
        phone: true,
        cellPhone: true,
        whatsapp: true,
        hasNumber: true,
        houseNumber: true,
        acceptTerm: true,
        email: true,
        cnpj: true,
        isAuthenticated: true,
        address: true,
        cep: true,
        city: true,
        state: true,
        neighborhood: true,
        complement: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        Medic: {
          where: { isAuthenticated: true },
          select: {
            id: true,
            name: true,
            cellPhone: true,
            cpf: true,
            phone: true,
            whatsapp: true,
            email: true,
            isAuthenticated: true,
            isWhatsapp: true,
            photo: true,
            gender: true,
            city: true,
            state: true,
            created_at: true,
            clinicId: true,
            specialty: {
              select: {
                id: true,
                specialty: true,
                medicId: true,
              },
            },
          },
        },
      },
    });

    // Filtrar clínicas e calcular distâncias
    const clinicsWithDistance: ClinicWithDistance[] = [];

    for (const clinic of clinics) {
      // Pular clínicas sem coordenadas
      if (!clinic.latitude || !clinic.longitude) {
        continue;
      }

      // Calcular distância
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

      // Filtrar apenas clínicas dentro do raio
      if (distanceInKm <= radiusInKm) {
        // Obter especialidades dos médicos ativos da clínica
        const clinicSpecialties = clinic.Medic
          .flatMap(medic => medic.specialty.map(spec => spec.specialty))
          .filter((specialty, index, self) => self.indexOf(specialty) === index); // Remove duplicatas

        // Se foram solicitadas especialidades específicas, filtrar
        if (requestedSpecialties && requestedSpecialties.length > 0) {
          const hasRequestedSpecialty = requestedSpecialties.some(requested =>
            clinicSpecialties.some(clinicSpec =>
              clinicSpec.toLowerCase().includes(requested.toLowerCase())
            )
          );

          if (!hasRequestedSpecialty) {
            continue; // Pula esta clínica se não tem a especialidade solicitada
          }
        }

        // Montar endereço completo da clínica
        const fullAddress = `${clinic.address}, N° ${clinic.houseNumber}, ${clinic.neighborhood}, ${clinic.city}, ${clinic.state}`;

        clinicsWithDistance.push({
          fullAdress: fullAddress,
          distanceInKm: Math.round(distanceInKm * 100) / 100,
          specialties: clinicSpecialties,
          ...clinic,
        });
      }
    }

    // Ordenar por distância
    clinicsWithDistance.sort((a, b) => a.distanceInKm - b.distanceInKm);

    // Se não encontrou nenhuma clínica
    if (clinicsWithDistance.length === 0) {
      return reply.status(404).send({
        message: `Nenhuma clínica encontrada em um raio de ${radiusInKm}km${requestedSpecialties && requestedSpecialties.length > 0 ? ` para as especialidades: ${requestedSpecialties.join(', ')}` : ''}.`,
        data: {
          totalFound: 0,
          patientCoordinates: {
            latitude: patientCoordinates.latitude,
            longitude: patientCoordinates.longitude,
          },
          clinics: [],
        },
      });
    }

    return reply.status(200).send({
      message: `${clinicsWithDistance.length} clínicas encontradas em um raio de ${radiusInKm}km.`,
      data: {
        totalFound: clinicsWithDistance.length,
        patientCoordinates: {
          latitude: patientCoordinates.latitude,
          longitude: patientCoordinates.longitude,
        },
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