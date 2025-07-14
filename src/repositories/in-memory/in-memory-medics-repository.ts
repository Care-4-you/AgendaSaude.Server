import {
  Medic,
  MedicCrm,
  MedicSpecialty,
  Prisma
} from "@prisma/client";
import { MedicsRepository } from "../medics-repository";
import { randomNumberWithDigits } from "@/utils/random-number-generate";

export class InMemoryMedicsRepository implements MedicsRepository {
  public items: Medic[] = [];
  public crmItems: MedicCrm[] = [];
  public specialtyItems: MedicSpecialty[] = [];

  async findById(id: number): Promise<Medic | null> {
    return this.items.find(m => m.id === id) || null;
  }

  async findByEmail(email: string): Promise<Medic | null> {
    return this.items.find(m => m.email === email) || null;
  }

  async findByCpf(cpf: string): Promise<Medic | null> {
    return this.items.find(m => m.cpf === cpf) || null;
  }

  async findByCrm(crmNumber: string): Promise<Medic | null> {
    const crm = this.crmItems.find(c => c.number === crmNumber);
    if (!crm) return null;

    return this.items.find(m => m.id === crm.medicId) || null;
  }

  async create(data: Prisma.MedicCreateInput): Promise<Medic> {
    const newMedic: Medic = {
      id: randomNumberWithDigits(),
      name: data.name,
      cpf: data.cpf,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      password_hash: data.password_hash,
      isAuthenticated: data.isAuthenticated ?? false,
      isWhatsapp: data.isWhatsapp ?? false,
      photo: data.photo ?? null,
      gender: data.gender,
      city: data.city,
      state: data.state,
      created_at: new Date(),
      clinicId: data.clinic?.connect?.id ?? null
    };

    this.items.push(newMedic);

    // Cria specialties
    if (data.specialty?.create) {
      const specialties = Array.isArray(data.specialty.create)
        ? data.specialty.create
        : [data.specialty.create];

      specialties.forEach(spec => {
        this.specialtyItems.push({
          id: randomNumberWithDigits(),
          specialty: spec.specialty,
          medicId: newMedic.id,
        });
      });
    }

    // Cria CRMs
    if (data.crm?.create) {
      const crms = Array.isArray(data.crm.create)
        ? data.crm.create
        : [data.crm.create];

      crms.forEach(crm => {
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

  async save(medic: Medic): Promise<Medic> {
    const index = this.items.findIndex(m => m.id === medic.id);
    if (index !== -1) {
      this.items[index] = medic;
    }
    return medic;
  }
}
