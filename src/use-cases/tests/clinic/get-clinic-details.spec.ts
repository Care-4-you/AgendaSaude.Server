import { describe, it, expect, beforeEach } from "vitest";
import { GetClinicDetailsUseCase } from "../../modules/clinic/getClinicDetails";
import { InMemoryClinicsRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { hashPassword } from "@/utils/hash-password";

let clinicsRepository: InMemoryClinicsRepository;
let sut: GetClinicDetailsUseCase;

describe("Get Clinic Details Use Case", () => {
  beforeEach(() => {
    clinicsRepository = new InMemoryClinicsRepository();
    sut = new GetClinicDetailsUseCase(clinicsRepository);
  });

  it("should be able to get clinic details", async () => {
    const clinic = await clinicsRepository.create({
      name: "Clínica Teste",
      phone: "11987654321",
      cellPhone: "11987654321",
      whatsapp: "11987654321",
      hasNumber: true,
      houseNumber: "123",
      acceptTerm: true,
      email: "test@example.com",
      cnpj: "12345678000123",
      password_hash: await hashPassword("123456"),
      address: "Rua Teste",
      cep: "12345678",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Centro",
      complement: "Apto 101",
      isAuthenticated: true,
      specialty: {
        create: [
          { value: "cardiology", label: "Cardiologia" },
          { value: "dermatology", label: "Dermatologia" }
        ]
      },
      healthInsurance: {
        create: [
          { value: "unimed", label: "Unimed" },
          { value: "amil", label: "Amil" }
        ]
      }
    });

    const { clinic: foundClinic } = await sut.execute({ id: clinic.id });

    expect(foundClinic).toBeDefined();
    expect(foundClinic?.id).toBe(clinic.id);
    expect(foundClinic?.name).toBe("Clínica Teste");
    expect(foundClinic?.email).toBe("test@example.com");
    expect(foundClinic?.specialty).toHaveLength(2);
    expect(foundClinic?.healthInsurance).toHaveLength(2);
  });

  it("should return null for non-existent clinic", async () => {
    const { clinic } = await sut.execute({ id: 999 });

    expect(clinic).toBeNull();
  });
});
