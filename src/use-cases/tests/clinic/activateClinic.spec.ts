import { activateClinic } from "@/http/controllers/clinic/activateClinic";
import { Clinic } from "@prisma/client";
import { FastifyRequest, FastifyReply } from "fastify";
import { describe, it, expect, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  clinic: {
    findUnique: vi.fn(),
    update: vi.fn()
  }
}));

const jwtMock = vi.hoisted(() => {
  const mock = {
    verify: vi.fn(),
    decode: vi.fn(),
    sign: vi.fn(),
    JsonWebTokenError: { name: 'JsonWebTokenError' },
    TokenExpiredError: { name: 'TokenExpiredError' },
    NotBeforeError: { name: 'NotBeforeError' }
  };

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
    const mockClinic: Clinic = {
      id: 1,
      name: "Test Clinic",
      phone: "123456789",
      cellPhone: "987654321", 
      whatsapp: "987654321",  
      hasNumber: true,        
      houseNumber: "42",      
      acceptTerm: true,       
      email: "test@clinic.com",
      cnpj: "12.345.678/0001-90",
      password_hash: "hashedpassword",
      address: "123 Clinic St",
      cep: "12345-678",
      city: "Clinic City",
      state: "Clinic State",
      neighborhood: "Clinic Neighborhood",
      complement: "Clinic Complement",
      isAuthenticated: false,
      createdAt: new Date(),
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