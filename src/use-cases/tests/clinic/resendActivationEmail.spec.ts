import { prisma } from "@/lib/prisma";
import { sendActivationEmail } from "@/utils/emails/send-activation-email";
import jwt from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { resendActivationEmail } from "@/http/controllers/clinic/resendActivationEmail";
import { mockDeep } from "jest-mock-extended";
import { env } from "@/env";
import { ZodError } from "zod";

// Mock dos módulos
const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    clinic: {
      findUnique: vi.fn(),
    },
  },
}));
vi.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));
vi.mock("@/utils/emails/send-activation-email");
vi.mock("jsonwebtoken");
vi.mock("@/env", () => ({
  env: {
    JWT_SECRET: "test-secret",
  },
}));

const mockClinic = {
  id: 1,
  name: "Test Clinic",
  specialty: "General",
  phone: "123456789",
  email: "test@clinic.com",
  cnpj: "12.345.678/0001-90",
  password_hash: "hashedpassword",
  address: "123 Clinic St",
  cep: "12345-678",
  city: "Clinic City",
  state: "Clinic State",
  neighborhood: "Clinic Neighborhood",
  complement: "Clinic Complement",
  created_at: new Date(),
  isAuthenticated: false,
};

describe("resendActivationEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should resend activation email", async () => {
    prismaMock.clinic.findUnique.mockResolvedValue(mockClinic);
    (jwt.sign as any).mockReturnValue("new-token");
    (sendActivationEmail as any).mockResolvedValue(undefined);

    const request = {
      body: { email: mockClinic.email },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await resendActivationEmail(request, reply);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        email: mockClinic.email,
        type: "clinicActivation",
      },
      env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    expect(sendActivationEmail).toHaveBeenCalledWith(
      mockClinic.email,
      mockClinic.name,
      "new-token"
    );

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Activation email has been sent. Please check your inbox.",
    });
  });

  it("should handle validation error for invalid email", async () => {
    const request = {
      body: { email: "invalid-email" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await expect(resendActivationEmail(request, reply)).rejects.toThrow(ZodError);
  });

  it("should handle missing email in request body", async () => {
    const request = {
      body: {},
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await expect(resendActivationEmail(request, reply)).rejects.toThrow(ZodError);
  });

  it("should handle error when sending activation email fails", async () => {
    const clinicForError = {
      id: 1,
      name: "Test Clinic",
      email: "test@clinic.com",
      isAuthenticated: false,
    };

    prismaMock.clinic.findUnique.mockResolvedValue(clinicForError as any);
    (jwt.sign as any).mockReturnValue("new-token");
    (sendActivationEmail as any).mockRejectedValue(new Error("Failed to send email"));

    const request = {
      body: { email: clinicForError.email },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await expect(resendActivationEmail(request, reply)).rejects.toThrow("Failed to send email");
  });

  it("should handle database error", async () => {
    prismaMock.clinic.findUnique.mockRejectedValue(new Error("Database error"));

    const request = {
      body: { email: "test@clinic.com" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await expect(resendActivationEmail(request, reply)).rejects.toThrow("Database error");
  });

  it("should return 404 if clinic not found", async () => {
    prismaMock.clinic.findUnique.mockResolvedValue(null);

    const request = {
      body: { email: "test@clinic.com" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await resendActivationEmail(request, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Clinic not found.",
    });
  });

  it("should return 200 if clinic is already activated", async () => {
    const mockClinicActivated = {
      ...mockClinic,
      isAuthenticated: true,
    };

    prismaMock.clinic.findUnique.mockResolvedValue(mockClinicActivated);

    const request = {
      body: { email: mockClinicActivated.email },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await resendActivationEmail(request, reply);

    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Clinic account is already activated.",
    });
  });
});
