export class InvalidDateError extends Error {
  constructor() {
    super("Date is not a valid");
  }
}
