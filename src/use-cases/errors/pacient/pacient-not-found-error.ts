export class PacientNotFoundError extends Error {
  constructor() {
    super("Pacient not found!");
  }
}
