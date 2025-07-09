export class EmailNotFoundError extends Error {
  constructor() {
    super("Email não encontrado no sistema.");
  }
}