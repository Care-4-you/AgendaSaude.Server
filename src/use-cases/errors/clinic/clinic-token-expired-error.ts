export class ClinicTokenExpiredError extends Error {
  constructor() {
    super("Clinic activation token has expired. Please request a new activation link.");
  }
}