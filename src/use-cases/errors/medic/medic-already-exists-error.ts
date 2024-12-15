export class MedicAlreadyExistsError extends Error {
  constructor(message: string) {
    super(message);
  }
}
