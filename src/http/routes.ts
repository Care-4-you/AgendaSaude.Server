import { FastifyInstance } from "fastify";
import { registerClinic } from "./modules/clinic/controllers/registerClinic";

export const appRoutes = async (app: FastifyInstance) => {
    // Rotas clinicas
    app.post("/clinics", registerClinic);
}