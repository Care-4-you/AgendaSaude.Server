export class MaxCrmExceededError extends Error {
  constructor(maxAllowed: number = 2) {
    super(`Maximum number of CRMs (${maxAllowed}) exceeded!`);
    this.name = "MaxCrmExceededError";
  }
}

export class DuplicateCrmInRequestError extends Error {
  constructor(crmNumber?: string, state?: string) {
    const message = crmNumber && state
      ? `Duplicate CRM ${crmNumber} for state ${state} found in the request.`
      : "Duplicate CRM entries found in the request.";
    super(message);
    this.name = "DuplicateCrmInRequestError";
  }
}

export class InvalidCrmFormatError extends Error {
  constructor(crmNumber?: string, state?: string) {
    const message = crmNumber && state
      ? `Invalid CRM format: ${crmNumber} for state ${state}`
      : "Invalid CRM format provided";
    super(message);
    this.name = "InvalidCrmFormatError";
  }
}