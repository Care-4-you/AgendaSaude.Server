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

  const validInput = {
    name: "Teste",
    phone: "1133330000",
    cellPhone: "11988880000",
    whatsapp: "11988880000",
    isWhatsapp: true,
    hasNumber: true,
    houseNumber: "123",
    acceptTerm: true,
    email: "teste@gmail.com",
    password: "123456",
    birth_date: new Date("2000-01-01"),           
    cpf: "88110865070",
    gender: { value: "M", label: "Masculino" },
    address: "Av. Geronio, 869",
    cep: "00174267",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Norte",
    complement: "",
  };

  it("Should be able to register a pacient", async () => {
    const { pacient } = await sut.execute(validInput);

    expect(pacient.id).toEqual(expect.any(Number));
    expect(pacient.cellPhone).toBe(validInput.cellPhone);
    expect(pacient.whatsapp).toBe(validInput.whatsapp);
    expect(pacient.gender).toEqual(validInput.gender);
  });

  it("Should hash pacient password upon registration", async () => {
    const { pacient } = await sut.execute(validInput);

    const isPasswordHashedValid = await compare(
      "123456",
      pacient.password_hash,
    );

    expect(isPasswordHashedValid).toBe(true);
  });

  it("Should not be able to register a pacient with same email", async () => {
    const email = "pacient@teste.com.br";

    await sut.execute({ ...validInput, email });

    await expect(() =>
      sut.execute({ ...validInput, email }),
    ).rejects.toBeInstanceOf(PacientAlreadyExistsError);
  });

  it("Should not be able to register a pacient with same cpf", async () => {
    const cpf = "12345678901";

    await sut.execute({ ...validInput, cpf });

    await expect(() =>
      sut.execute({ ...validInput, cpf }),
    ).rejects.toBeInstanceOf(PacientAlreadyExistsError);
  });
});
