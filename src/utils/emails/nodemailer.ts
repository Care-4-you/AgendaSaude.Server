import { createTransport } from "nodemailer";

const transport = createTransport({
  host: "smtp-relay.gmail.com",
  port: 465,
  secure: true, // true para porta Gmail e false para outras portas
  auth: {
    user: "care4you.lab.soujunior@gmail.com",
    pass: "4lexanderFl3m1ng",
  },
});

transport
  .sendMail({
    from: "Teste envio <care4you.lab.soujunior@gmail.com>",
    to: "",
    subject: "Enviando e-mail",
    //html: "",
    text: "",
  })
  .then((response) => console.log("E-mail enviado com sucesso!"))
  .catch((error) => console.error(`Error ao envio do email: ${error.message}`));
