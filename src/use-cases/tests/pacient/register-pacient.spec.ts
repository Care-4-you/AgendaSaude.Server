import { InMemoryPacientsRepository } from "@/repositories/in-memory/in-memory-pacients-repository";
import { RegisterPacientUseCase } from "@/use-cases/modules/pacient/register-pacient";
import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { PacientAlreadyExistsError } from "@/use-cases/errors/pacient/pacient-already-exists-error";

let pacientRepository: InMemoryPacientsRepository;
let sut: RegisterPacientUseCase;

describe("Register Pacient Use Case", () => {
  beforeEach(() => {
    pacientRepository = new InMemoryPacientsRepository();
    sut = new RegisterPacientUseCase(pacientRepository);
  });

  it("Should be able to register a pacient", async () => {
    const { pacient } = await sut.execute({
      name: "Teste",
      phone: "11989234575",
      email: "teste@gmail.com",
      password: "123456",
      birth_date: "20/03/2002",
      cpf: "88110865070",
      gender: "Masculino",
      address: "Av. Geronio, 869",
      cep: "00174-267",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Norte",
      complement: "",
    });

    expect(pacient.id).toEqual(expect.any(Number));
  });

  it("Should hash pacient password upon registration", async () => {
    const { pacient } = await sut.execute({
      name: "Teste",
      phone: "11989234575",
      email: "teste@gmail.com",
      password: "123456",
      birth_date: "20/03/2002",
      cpf: "88110865070",
      gender: "Masculino",
      address: "Av. Geronio, 869",
      cep: "00174-267",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Norte",
      complement: "",
    });

    const isPasswordHashedValid = await compare(
      "123456",
      pacient.password_hash,
    );

    expect(isPasswordHashedValid).toBe(true);
  });

  it("Should not be able to register a pacient with same password", async () => {
    const email = "pacient@teste.com.br";

    await sut.execute({
      name: "Teste",
      phone: "11989234575",
      email,
      password: "123456",
      birth_date: "20/03/2002",
      cpf: "88110865070",
      gender: "Masculino",
      address: "Av. Geronio, 869",
      cep: "00174-267",
      city: "São Paulo",
      state: "SP",
      neighborhood: "Norte",
      complement: "",
    });

    await expect(() =>
      sut.execute({
        name: "Teste",
        phone: "11989234575",
        email,
        password: "123456",
        birth_date: "20/03/2002",
        cpf: "88110865070",
        gender: "Masculino",
        address: "Av. Geronio, 869",
        cep: "00174-267",
        city: "São Paulo",
        state: "SP",
        neighborhood: "Norte",
        complement: "",
      }),
    ).rejects.toBeInstanceOf(PacientAlreadyExistsError);
  });
});
