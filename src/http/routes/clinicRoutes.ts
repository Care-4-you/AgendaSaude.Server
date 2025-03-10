import { FastifyInstance } from "fastify";
import { verifyJwt } from "../middlewares/verify-jwt";
import { registerClinic } from "../controllers/clinic/registerClinic";
import { activateClinic } from "../controllers/clinic/activateClinic";
import { resendActivationEmail } from "../controllers/clinic/resendActivationEmail";

export const clinicRoutes = async (app: FastifyInstance) => {
  app.post("/clinics", registerClinic);
  app.get("/clinics/activate", activateClinic);
  app.post("/clinics/resend-activation", resendActivationEmail);
};
