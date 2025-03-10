import { createTransport } from "nodemailer";
import { env } from "@/env";

export const sendActivationEmail = async (
  email: string,
  clinicName: string,
  activationToken: string
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

  const activationLink = `http://localhost:8080/clinics/activate?token=${activationToken}`;

  const mailOptions = {
    from: {
      name: "Agenda Saúde",
      address: env.EMAIL_USER,
    },
    to: email,
    subject: "Ativação de Conta - Agenda Saúde",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; box-shadow: 0 2px 10px rgba(0,0,0,0.08);">
        <!-- Cabeçalho -->
        <div style="background-color: #4CAF50; padding: 15px; border-radius: 6px 6px 0 0; margin-bottom: 20px;">
          <h1 style="color: white; margin: 0; font-weight: 500; text-align: center;">Agenda Saúde</h1>
        </div>
        
        <!-- Conteúdo -->
        <div style="padding: 0 15px;">
          <h2 style="color: #333; margin-bottom: 20px;">Olá, ${clinicName}!</h2>
          
          <p style="color: #555; line-height: 1.5; margin-bottom: 25px; font-size: 16px;">
            Agradecemos por escolher a <strong>Agenda Saúde</strong> para sua clínica. Estamos quase prontos!
          </p>
          
          <p style="color: #555; line-height: 1.5; margin-bottom: 30px; font-size: 16px;">
            Para começar a usar nossos serviços, ative sua conta agora:
          </p>
          
          <!-- Botão centralizado e mais atraente -->
          <div style="text-align: center; margin: 35px 0;">
            <a href="${activationLink}" 
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
              ATIVAR MINHA CONTA
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; line-height: 1.5;">
            Se o botão não funcionar, copie e cole este link no seu navegador:
            <br>
            <a href="${activationLink}" style="color: #4CAF50; word-break: break-all;">${activationLink}</a>
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
      Olá, ${clinicName}!
      
      Agradecemos por escolher a Agenda Saúde para sua clínica. Estamos quase prontos!
      
      Para começar a usar nossos serviços, ative sua conta agora através do link:
      
      ${activationLink}
      
      Este é um email automático. Por favor, não responda esta mensagem.
      
      © ${new Date().getFullYear()} Agenda Saúde - Todos os direitos reservados.
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log(`Email de ativação enviado para: ${email}`);
    return true;
  } catch (error) {
    console.error(`Erro ao enviar email de ativação: ${error}`);
    throw new Error("Failed to send activation email");
  }
};