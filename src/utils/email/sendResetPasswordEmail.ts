import { env } from "@/env";
import { createEmailTransport } from "./createEmailTransport";
import { USER_CONFIG } from "./userConfig";
import { createEmailTemplate } from "./createEmailTemplate";

export const sendResetPasswordEmail = async (
  email: string,
  userName: string,
  resetToken: string,
  userType: UserType
) => {
  const transport = createEmailTransport();
  const config = USER_CONFIG[userType];

  const resetLink = `http://localhost:${config.resetPort}/password/reset/${resetToken}`;

  const content = `Recebemos uma solicitação para redefinir sua senha de acesso na <strong>Agenda Saúde</strong>. Para criar uma nova senha, clique no botão abaixo:`;

  const additionalInfo = `<strong>Atenção:</strong> Este link é válido por 4 horas e pode ser usado apenas uma vez.<br>Caso você não tenha solicitado esta redefinição de senha, por favor ignore este email.`;

  const mailOptions = {
    from: {
      name: "Agenda Saúde",
      address: env.EMAIL_USER,
    },
    to: email,
    subject: "Redefinição de Senha - Agenda Saúde",
    html: createEmailTemplate(
      "Redefinição de Senha",
      config.greeting,
      userName,
      content,
      "REDEFINIR MINHA SENHA",
      resetLink,
      additionalInfo
    ),
    text: `
      Olá, ${userName}!
      
      Recebemos uma solicitação para redefinir sua senha de acesso na Agenda Saúde.
      
      Para criar uma nova senha, acesse o link abaixo:
      
      ${resetLink}
      
      Atenção: Este link é válido por 4 horas e pode ser usado apenas uma vez.
      Caso você não tenha solicitado esta redefinição de senha, por favor ignore este email.
      
      Este é um email automático. Por favor, não responda esta mensagem.
      
      © ${new Date().getFullYear()} Agenda Saúde - Todos os direitos reservados.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email de redefinição de senha enviado para: ${email} (${userType})`);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar email de redefinição de senha: ${error}`);
    throw new Error("Falha ao enviar email de redefinição de senha");
  }
};