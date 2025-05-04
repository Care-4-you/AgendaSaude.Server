import { createTransport } from "nodemailer";
import { env } from "@/env";

export const sendResetPasswordEmail = async (
  email: string,
  userName: string,
  resetToken: string,
  role: string
) => {
  const transport = createTransport({
    service: env.EMAIL_SERVICE,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });

  const resetLink = `http://localhost:3000/password/reset/${resetToken}`;

  const mailOptions = {
    from: {
      name: "Agenda Saúde",
      address: env.EMAIL_USER,
    },
    to: email,
    subject: "Redefinição de Senha - Agenda Saúde",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
        <!-- Cabeçalho -->
        <div style="background-color: #4CAF50; padding: 15px; border-radius: 6px 6px 0 0; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-weight: 500; text-align: center;">Agenda Saúde</h1>
        </div>
        
        <!-- Conteúdo -->
        <div style="padding: 0 15px;">
          <h2 style="color: #333; margin-bottom: 20px;">Olá, ${userName}!</h2>
          
          <p style="color: #555; line-height: 1.5; margin-bottom: 25px; font-size: 16px;">
            Recebemos uma solicitação para redefinir sua senha de acesso na <strong>Agenda Saúde</strong>.
          </p>
          
          <p style="color: #555; line-height: 1.5; margin-bottom: 30px; font-size: 16px;">
            Para criar uma nova senha, clique no botão abaixo:
          </p>
          
          <!-- Botão centralizado e mais atraente -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetLink}" 
               style="background-color: #4CAF50; 
                      color: white; 
                      padding: 14px 28px; 
                      text-decoration: none; 
                      border-radius: 4px;
                      font-size: 16px;
                      font-weight: bold;
                      display: inline-block;
                      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                      transition: background-color 0.3s;">
              REDEFINIR MINHA SENHA
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; line-height: 1.5;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
            <br>
            <a href="${resetLink}" style="color: #4CAF50; word-break: break-all;">${resetLink}</a>
          </p>
          
          <p style="color: #555; line-height: 1.5; margin-top: 25px; font-size: 14px;">
            <strong>Atenção:</strong> Este link é válido por 4 horas e pode ser usado apenas uma vez.
            <br>
            Caso você não tenha solicitado esta redefinição de senha, por favor ignore este email.
          </p>
        </div>
        
        <!-- Rodapé -->
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
          <p>
            Este é um email automático. Por favor, não responda esta mensagem.
            <br>
            Em caso de dúvidas, entre em contato com nosso suporte.
          </p>
          <p>© ${new Date().getFullYear()} Agenda Saúde - Todos os direitos reservados.</p>
        </div>
      </div>
    `,
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
    console.log(`Email de redefinição de senha enviado para: ${email}`);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar email de redefinição de senha: ${error}`);
    throw new Error("Falha ao enviar email de redefinição de senha");
  }
};