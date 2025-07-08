import { FastifyInstance } from "fastify";
import { verifyJwt } from "../middlewares/verify-jwt";
import { registerClinic } from "../controllers/clinic/registerClinic";
import { activateClinic } from "../controllers/clinic/activateClinic";
import { resendActivationEmail } from "../controllers/clinic/resendActivationEmail";
import { getClinicDetails } from "../controllers/clinic/getClinicDetails";
import { getAllClinics } from "../controllers/clinic/getAllClinics";

export const clinicRoutes = async (app: FastifyInstance) => {
  app.post("/clinics", registerClinic);
  app.get("/clinics/activate", activateClinic);
  app.post("/clinics/resend-activation", resendActivationEmail);
  app.get("/clinics/:id", getClinicDetails);
  app.get("/clinics", getAllClinics);
};
