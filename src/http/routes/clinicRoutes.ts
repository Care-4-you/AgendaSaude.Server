import { FastifyInstance } from "fastify";
import { verifyJwt } from "../middlewares/verify-jwt";
import { registerClinic } from "../controllers/clinic/registerClinic";

export const clinicRoutes = async (app: FastifyInstance) => {
  app.post("/clinics", registerClinic);
};
