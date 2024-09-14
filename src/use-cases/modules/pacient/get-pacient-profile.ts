import { PacientsRepository } from "@/repositories/pacients-repository";
import { Pacient } from "@prisma/client";
import { PacientNotFoundError } from "./../../errors/pacient/pacient-not-found-error";
import { InvalidDataPassedError } from "@/use-cases/errors/invalid-data-passed-error";

interface IGetPacientProfile {
  pacientId: number | null;
}

interface IGetPacientProfileResponse {
  pacient: Pacient;
}

export class GetPacientProfileUseCase {
  constructor(private pacientRepository: PacientsRepository) {}

  execute = async ({
    pacientId,
  }: IGetPacientProfile): Promise<IGetPacientProfileResponse> => {
    if (!pacientId) {
      throw new InvalidDataPassedError(
        "PacientId is required to be a type Number!",
      );
    }

    const pacient = await this.pacientRepository.findById(pacientId);

    if (!pacient) {
      throw new PacientNotFoundError();
    }

    return {
      pacient,
    };
  };
}
