import { FastifyInstance } from "fastify";
import { registerClinic } from "./controllers/clinic/registerClinic";

export const appRoutes = async (app: FastifyInstance) => {
  app.get("/", () => {
    return "Conexão API Care4You!";
  });

  // Rotas clinicas
  app.post("/clinics", registerClinic);
};
