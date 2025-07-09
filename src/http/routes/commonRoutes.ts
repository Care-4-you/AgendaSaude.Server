import { FastifyInstance } from "fastify";
import { requestPasswordReset } from "../controllers/common/requestPasswordReset";
import { resetPassword } from "../controllers/common/resetPassword";

export const commonRoutes = async (app: FastifyInstance) => {
  // Rotas de redefinição de senha
  app.post("/auth/password/request-reset", requestPasswordReset);
  app.post("/auth/password/reset-password", resetPassword);
};