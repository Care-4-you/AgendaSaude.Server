export class MedicAlreadyExistsError extends Error {
  constructor(field?: 'email' | 'cpf') {
    const message = field 
      ? `Medic with this ${field} already exists in the system!`
      : "Medic e-mail or CPF already in the system!";
    super(message);
    this.name = "MedicAlreadyExistsError";
  }
}

export class MedicCrmAlreadyExistsError extends Error {
  constructor(crmNumber?: string, state?: string) {
    const message = crmNumber && state
      ? `CRM ${crmNumber} for state ${state} already exists in the system!`
      : "Medic CRM number with this state already exists!";
    super(message);
    this.name = "MedicCrmAlreadyExistsError";
  }
}