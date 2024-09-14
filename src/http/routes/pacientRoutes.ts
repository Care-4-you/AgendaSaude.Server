import { FastifyInstance } from "fastify";
import { registerPacient } from "../controllers/pacient/registePacient";
import { pacientAuthenticate } from "../controllers/auth/pacient-authenticate";
import { profilePacient } from "../controllers/pacient/profilePacient";
import { verifyJwt } from "../middlewares/verify-jwt";

export const pacientRoutes = async (app: FastifyInstance) => {
  // Rotas para pacientes
  app.post("/pacients", registerPacient);

  app.post("/pacient/session", pacientAuthenticate);

  app.get("/pacient", { onRequest: [verifyJwt] }, profilePacient);
};
