export class ClinicAlreadyExistsError extends Error {
  constructor() {
    super("Clinic e-mail already in the system!");
  }
}
