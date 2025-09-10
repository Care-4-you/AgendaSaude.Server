import { createTransport } from "nodemailer";
import { env } from "@/env";

export const createEmailTransport = () => {
  return createTransport({
    service: env.EMAIL_SERVICE,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};