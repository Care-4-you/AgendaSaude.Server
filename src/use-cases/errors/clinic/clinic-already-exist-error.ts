export class ClinicAlreadyExistsError extends Error {
  constructor() {
    super("Clinic e-mail or CNPJ already in the system!");
  }
}
