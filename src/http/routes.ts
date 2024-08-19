import { FastifyInstance } from "fastify";
import { registerClinic } from "./controllers/clinic/registerClinic";
import { registerPacient } from "./controllers/pacient/registePacient";
import { pacientAuthenticate } from "./controllers/auth/pacient-authenticate";

export const appRoutes = async (app: FastifyInstance) => {
  app.get("/", () => {
    return "Conexão API Care4You!";
  });

  // Rotas clinicas
  app.post("/clinics", registerClinic);

  // Rotas para pacientes
  app.post("/pacients", registerPacient);

  app.post("/pacient/session", pacientAuthenticate);
};
