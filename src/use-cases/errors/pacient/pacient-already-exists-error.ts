export class PacientAlreadyExistsError extends Error {
  constructor() {
    super("Pacient e-mail already exists!");
  }
}
