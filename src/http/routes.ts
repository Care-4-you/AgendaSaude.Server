import { FastifyInstance } from "fastify";

import { registerClinic } from "./controllers/clinic/registerClinic";
import { pacientRoutes } from "./routes/pacientRoutes";
import { clinicRoutes } from "./routes/clinicRoutes";
import { createTransport } from "nodemailer";

export const appRoutes = async (app: FastifyInstance) => {
  app.get("/", () => {
    return "Conexão API Care4You!";
  });

  app.get("/teste", () => {
    const transport = createTransport({
      host: "smtp.mail.yahoo.com",
      port: 465,
      secure: true, // true para porta SSL
      auth: {
        user: "care4you.validation@yahoo.com",
        pass: "!4lexanderFl3m1ng!",
      },
    });

    transport
      .sendMail({
        from: "care4you.validation@yahoo.com",
        to: "pedroaolive@gmail.com",
        subject: "Enviando e-mail",
        //html: "",
        text: "Teste",
      })
      .then((response) => console.log("E-mail enviado com sucesso!"))
      .catch((error) =>
        console.error(`Error ao envio do email: ${error.message}`),
      );
  });

  await app.register(pacientRoutes);

  await app.register(clinicRoutes);
};
