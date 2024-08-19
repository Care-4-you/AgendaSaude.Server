import { compare } from "bcryptjs";
import { Pacient } from "@prisma/client";
import { PacientsRepository } from "@/repositories/pacients-repository";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

interface PacientAuthenticateUseCaseRequest {
  email: string;
  password: string;
}

interface PacientAuthenticateUseCaseResponse {
  pacient: Pacient;
}

export class PacientAuthenticateUseCase {
  constructor(private pacientRepository: PacientsRepository) {}

  execute = async ({
    email,
    password,
  }: PacientAuthenticateUseCaseRequest): Promise<PacientAuthenticateUseCaseResponse> => {
    const pacient = await this.pacientRepository.findByEmail(email);

    if (!pacient) {
      throw new InvalidCredentialsError();
    }

    const doesPasswordMatches = await compare(password, pacient.password_hash);

    if (!doesPasswordMatches) {
      throw new InvalidCredentialsError();
    }

    return {
      pacient,
    };
  };
}
