import { env } from "@/env";
import { USER_CONFIG } from "./userConfig";
import { createEmailTransport } from "./createEmailTransport";
import { createEmailTemplate } from "./createEmailTemplate";

// Função unificada para email de ativação
export const sendActivationEmail = async (
  email: string,
  userName: string,
  activationToken: string,
  userType: UserType
) => {
  const transport = createEmailTransport();
  const config = USER_CONFIG[userType];

  const activationLink = `http://localhost:${config.activationPort}${config.activationPath}?token=${activationToken}`;

  const content = `Agradecemos por escolher a <strong>Agenda Saúde</strong>. Para começar a usar nossos serviços, ative sua conta agora:`;

  const mailOptions = {
    from: {
      name: "Agenda Saúde",
      address: env.EMAIL_USER,
    },
    to: email,
    subject: "Ativação de Conta - Agenda Saúde",
    html: createEmailTemplate(
      "Ativação de Conta",
      config.greeting,
      userName,
      content,
      "ATIVAR MINHA CONTA",
      activationLink
    ),
    text: `
      Olá, ${userName}!
      
      Agradecemos por escolher a Agenda Saúde. Para começar a usar nossos serviços, ative sua conta através do link:
      
      ${activationLink}
      
      Este é um email automático. Por favor, não responda esta mensagem.
      
      © ${new Date().getFullYear()} Agenda Saúde - Todos os direitos reservados.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email de ativação enviado para: ${email} (${userType})`);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar email de ativação: ${error}`);
    throw new Error("Failed to send activation email");
  }
};
