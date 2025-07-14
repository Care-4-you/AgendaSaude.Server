import { FastifyInstance } from "fastify";
import { registerMedic } from "../controllers/medic/registerMedic";
import { verifyMedic } from "../controllers/medic/verifyMedic"; 

export const medicRoutes = async (app: FastifyInstance) => {
  // Rota de cadastro de médico
  app.post("/medics", registerMedic);

  // Rota de verificação de CRM + Estado
  app.get("/medics", verifyMedic);
};
