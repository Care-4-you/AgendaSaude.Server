import nodemailer from "nodemailer";
import { env } from "@/env";
import { sendActivationEmail } from "@/utils/email/sendActivationEmail";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("nodemailer");

describe("sendActivationEmail", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should send an activation email", async () => {
    const sendMailMock = vi.fn().mockResolvedValue(true);
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const email = "test@clinic.com";
    const clinicName = "Test Clinic";
    const activationToken = "test-token";

    await sendActivationEmail(email, clinicName, activationToken, "clinics");
    expect(sendMailMock).toHaveBeenCalled();

    expect(sendMailMock).toHaveBeenCalledWith({
      from: {
        name: "Agenda Saúde",
        address: env.EMAIL_USER,
      },
      to: email,
      subject: "Ativação de Conta - Agenda Saúde",
      html: expect.any(String),
      text: expect.any(String),
    });
  });

  it("should throw an error if email sending fails", async () => {
    const sendMailMock = vi.fn().mockRejectedValue(new Error("Failed to send email"));
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const email = "test@clinic.com";
    const clinicName = "Test Clinic";
    const activationToken = "test-token";

    await expect(sendActivationEmail(email, clinicName, activationToken, "clinics"))
      .rejects.toThrow("Failed to send activation email");
  });

  it("should include the activation link in the email content", async () => {
    const sendMailMock = vi.fn().mockImplementation((options) => {
      return Promise.resolve(true);
    });
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const email = "test@clinic.com";
    const clinicName = "Test Clinic";
    const activationToken = "test-token";
    const expectedLink = `http://localhost:8080/clinics/activate?token=${activationToken}`;

    await sendActivationEmail(email, clinicName, activationToken, "clinics");

    const mailOptions = sendMailMock.mock.calls[0][0];
    expect(mailOptions.html).toContain(expectedLink);
    expect(mailOptions.text).toContain(expectedLink);
  });

  it("should include the clinic name in the email content", async () => {
    const sendMailMock = vi.fn().mockResolvedValue(true);
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const email = "test@clinic.com";
    const clinicName = "Test Clinic";
    const activationToken = "test-token";

    await sendActivationEmail(email, clinicName, activationToken, "clinics");

    const mailOptions = sendMailMock.mock.calls[0][0];
    expect(mailOptions.html).toContain(clinicName);
    expect(mailOptions.text).toContain(clinicName);
  });

  it("should use the correct transport configuration", async () => {
    const sendMailMock = vi.fn().mockResolvedValue(true);
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const email = "test@clinic.com";
    const clinicName = "Test Clinic";
    const activationToken = "test-token";

    await sendActivationEmail(email, clinicName, activationToken, "clinics");

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: env.EMAIL_SERVICE,
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });
  });

  it("should log success message when email is sent", async () => {
    const consoleSpy = vi.spyOn(console, "log");
    const sendMailMock = vi.fn().mockResolvedValue(true);
    (nodemailer.createTransport as any).mockReturnValue({ sendMail: sendMailMock });

    const email = "test@clinic.com";
    const clinicName = "Test Clinic";
    const activationToken = "test-token";

    const result = await sendActivationEmail(email, clinicName, activationToken, "clinics");

    expect(result).toBe(true);
    expect(consoleSpy).toHaveBeenCalledWith(`Email de ativação enviado para: ${email}`);
  });
});