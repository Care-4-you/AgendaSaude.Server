import { Medic, MedicCrm, Prisma } from "@prisma/client";
import { MedicsRepository } from "../medics-repository";
import { randomNumberWithDigits } from "@/utils/random-number-generate";

export class InMemoryMedicsRepository implements MedicsRepository {
  public items: Medic[] = [];
  public crmItems: MedicCrm[] = [];

  async findByCrmNumberAndState(number: string, state: string): Promise<Medic | null> {
    const crm = this.crmItems.find(
      (c) => c.number === number && c.state === state
    );
    if (!crm) return null;

    return this.items.find((m) => m.id === crm.medicId) || null;
  }

  async create(data: Prisma.MedicCreateInput): Promise<Medic> {
    const newMedic: Medic = {
      id: randomNumberWithDigits(),
      name: data.name,
      cpf: data.cpf ?? "", 
      phone: data.phone,
      cellPhone: data.cellPhone ?? '',
      whatsapp: data.whatsapp,
      email: data.email,
      password_hash: data.password_hash,
      isAuthenticated: data.isAuthenticated ?? false,
      isWhatsapp: data.isWhatsapp ?? false,
      photo: data.photo ?? null,
      gender: data.gender,
      city: data.city ?? null,
      state: data.state ?? null,
      created_at: new Date(),
      clinicId: data.clinic?.connect?.id ?? null,
    };

    this.items.push(newMedic);

    if (data.crm?.create) {
      const crms = Array.isArray(data.crm.create)
        ? data.crm.create
        : [data.crm.create];

      crms.forEach((crm) => {
        this.crmItems.push({
          id: randomNumberWithDigits(),
          number: crm.number,
          state: crm.state,
          medicId: newMedic.id,
        });
      });
    }

    return newMedic;
  }
}
