import { FastifyInstance } from "fastify";
import { pacientRoutes } from "./routes/pacientRoutes";
import { clinicRoutes } from "./routes/clinicRoutes";

export const appRoutes = async (app: FastifyInstance) => {
  app.get("/", () => {
    return "Conexão API Care4You!";
  });

  await app.register(pacientRoutes);

  await app.register(clinicRoutes);
};
