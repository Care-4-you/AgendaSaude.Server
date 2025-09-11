import { FastifyInstance } from "fastify";
import { registerClinic } from "../controllers/clinic/registerClinic";
import { activateClinic } from "../controllers/clinic/activateClinic";
import { resendActivationEmail } from "../controllers/clinic/resendActivationEmail";
import { getClinicDetails } from "../controllers/clinic/getClinicDetails";
import { getAllActiveClinics } from "../controllers/clinic/getAllActiveClinics";
import { getClinicSpecialties } from "../controllers/clinic/getClinicSpecialties";

export const clinicRoutes = async (app: FastifyInstance) => {
  app.post("/clinics", registerClinic);
  app.get("/clinics/activate", activateClinic);
  app.post("/clinics/resend-activation", resendActivationEmail);
  app.get("/clinics/:id", getClinicDetails);
  app.get("/clinics/active", getAllActiveClinics);
  app.get("/clinics/:clinicId/specialties", getClinicSpecialties);
};