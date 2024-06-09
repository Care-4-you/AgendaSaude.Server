import { InMemoryClinicsRepository } from "@/repositories/in-memory/in-memory-clinics-repository";
import { ClinicAlreadyExistsError } from "@/use-cases/errors/clinic/clinic-already-exist-error";
import { RegisterClinicUseCase } from "@/use-cases/modules/clinic/registerClinic";
import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";

let clinicsRepository: InMemoryClinicsRepository;
let sut: RegisterClinicUseCase;

describe("Register Clinic Use Case", () => {
  beforeEach(() => {
    clinicsRepository = new InMemoryClinicsRepository();
    sut = new RegisterClinicUseCase(clinicsRepository);
  });

  it("Should be able to register a clinic", async () => {
    const { clinic } = await sut.execute({
      name: "Clinica Teste",
      specialty: "Cirurgia",
      phone: "11989234518",
      email: "clinica@teste.com.br",
      password: "123456",
      address: "Av. Tal, 359",
      cep: "00171-397",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Centro",
      complement: "Clinica",
    });

    expect(clinic.id).toEqual(expect.any(Number));
  });

  it("Should hash clinic password upon registration", async () => {
    const { clinic } = await sut.execute({
      name: "Clinica Teste",
      specialty: "Cirurgia",
      phone: "11989234518",
      email: "clinica@teste.com.br",
      password: "123456",
      address: "Av. Tal, 359",
      cep: "00171-397",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Centro",
      complement: "Clinica",
    });

    const isPasswordHashedValid = await compare("123456", clinic.password_hash);

    expect(isPasswordHashedValid).toBe(true);
  });

  it("Should not be able to register a clinic with same password", async () => {
    const email = "clinica@teste.com.br";

    await sut.execute({
      name: "Clinica Teste",
      specialty: "Cirurgia",
      phone: "11989234518",
      email,
      password: "123456",
      address: "Av. Tal, 359",
      cep: "00171-397",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Centro",
      complement: "Clinica",
    });

    await expect(() =>
      sut.execute({
        name: "Clinica Teste",
        specialty: "Cirurgia",
        phone: "11989234518",
        email,
        password: "123456",
        address: "Av. Tal, 359",
        cep: "00171-397",
        city: "São Paulo",
        state: "SP",
        neighborhood: "Centro",
        complement: "Clinica",
      }),
    ).rejects.toBeInstanceOf(ClinicAlreadyExistsError);
  });
});
