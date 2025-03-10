import { activateClinic } from "@/http/controllers/clinic/activateClinic";
import { prisma } from "@/lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { describe, it, expect, vi } from "vitest";

// Mock dos módulos com Vitest
const prismaMock = vi.hoisted(() => ({
  clinic: {
    findUnique: vi.fn(),
    update: vi.fn()
  }
}));

// Mock simplificado do jsonwebtoken que não usa classes personalizadas
const jwtMock = vi.hoisted(() => {
  const mock = {
    verify: vi.fn(),
    decode: vi.fn(),
    sign: vi.fn(),
    JsonWebTokenError: { name: 'JsonWebTokenError' },
    TokenExpiredError: { name: 'TokenExpiredError' },
    NotBeforeError: { name: 'NotBeforeError' }
  };

  // Retornar o mock como exportação padrão e também como propriedades individuais
  return {
    default: mock,
    ...mock
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock
}));

vi.mock("jsonwebtoken", () => jwtMock);

describe("activateClinic", () => {
  it("should activate a clinic account", async () => {
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

    prismaMock.clinic.findUnique.mockResolvedValue(mockClinic);
    prismaMock.clinic.update.mockResolvedValue({ ...mockClinic, isAuthenticated: true });
    jwtMock.verify.mockReturnValue({ email: mockClinic.email, type: "clinicActivation" });

    const request = {
      query: { token: "valid-token" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await activateClinic(request, reply);

    expect(prismaMock.clinic.update).toHaveBeenCalledWith({
      where: { id: mockClinic.id },
      data: { isAuthenticated: true },
    });
    expect(reply.status).toHaveBeenCalledWith(200);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Clinic account activated successfully.",
    });
  });

  it("should return 404 if clinic not found", async () => {
    prismaMock.clinic.findUnique.mockResolvedValue(null);
    jwtMock.verify.mockReturnValue({ email: "test@clinic.com", type: "clinicActivation" });

    const request = {
      query: { token: "valid-token" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await activateClinic(request, reply);

    expect(reply.status).toHaveBeenCalledWith(404);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Clinic not found.",
    });
  });

  it("should return 400 if token type is invalid", async () => {
    jwtMock.verify.mockReturnValue({ email: "test@clinic.com", type: "invalidType" });

    const request = {
      query: { token: "valid-token" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await activateClinic(request, reply);

    expect(reply.status).toHaveBeenCalledWith(400);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid activation token.",
    });
  });

  it("should return 401 if token is invalid or expired", async () => {
    // Usar um erro com o nome correto, sem precisar de classes personalizadas
    const error = new Error("invalid token");
    error.name = "JsonWebTokenError";
    jwtMock.verify.mockImplementation(() => {
      throw error;
    });

    const request = {
      query: { token: "invalid-token" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await activateClinic(request, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid or expired activation token. Please request a new activation link.",
    });
  });

  it("should handle token expiration error", async () => {
    // Usar um erro com o nome correto, sem precisar de classes personalizadas
    const error = new Error("token expired");
    error.name = "TokenExpiredError";
    jwtMock.verify.mockImplementation(() => {
      throw error;
    });

    const request = {
      query: { token: "expired-token" },
    } as FastifyRequest;

    const reply = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    } as unknown as FastifyReply;

    await activateClinic(request, reply);

    expect(reply.status).toHaveBeenCalledWith(401);
    expect(reply.send).toHaveBeenCalledWith({
      message: "Invalid or expired activation token. Please request a new activation link.",
    });
  });
});