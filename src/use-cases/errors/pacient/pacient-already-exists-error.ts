export class PacientAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
  }
}
