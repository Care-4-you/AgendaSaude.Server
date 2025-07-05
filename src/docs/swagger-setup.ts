import { FastifyInstance } from 'fastify';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

export async function setupSwagger(app: FastifyInstance) {
  // Register the Swagger plugin
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Care4You API',
        description: 'API para Care4You, que conecta pacientes e clínicas médicas',
        version: '1.0.0'
      },
      servers: [
        {
          url: 'http://localhost:8080',
          description: 'Servidor de desenvolvimento'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        },
        schemas: {
          // Pacient schemas
          PacientRegister: {
            type: 'object',
            required: [
              'name', 'phone', 'cellPhone', 'whatsapp', 'isWhatsapp', 'hasNumber', 'houseNumber',
              'acceptTerm', 'email', 'password', 'passwordConfirmation', 'birth_date', 'cpf',
              'gender', 'address', 'cep', 'city', 'state', 'neighborhood'
            ],
            properties: {
              name: { type: 'string', example: 'João Silva' },
              phone: { type: 'string', example: '1133330000' },
              cellPhone: { type: 'string', example: '11988880000' },
              whatsapp: { type: 'string', example: '11988880000' },
              isWhatsapp: { type: 'boolean', example: true },
              hasNumber: { type: 'boolean', example: true },
              houseNumber: { type: 'string', example: '123' },
              acceptTerm: { type: 'boolean', example: true },
              email: { type: 'string', format: 'email', example: 'joao@email.com' },
              password: { type: 'string', format: 'password', example: 'senha123' },
              passwordConfirmation: { type: 'string', format: 'password', example: 'senha123' },
              birth_date: { type: 'string', example: '2000-01-01' },
              cpf: { type: 'string', maxLength: 11, example: '12345678901' },
              gender: {
                type: 'object',
                properties: {
                  value: { type: 'string', example: 'M' },
                  label: { type: 'string', example: 'Masculino' }
                }
              },
              address: { type: 'string', example: 'Rua das Flores, 123' },
              cep: { type: 'string', example: '01234-567' },
              city: { type: 'string', example: 'São Paulo' },
              state: { type: 'string', example: 'SP' },
              neighborhood: { type: 'string', example: 'Centro' },
              complement: { type: 'string', example: 'Apto 42', nullable: true }
            }
          },
          PacientResponse: {
            type: 'object',
            properties: {
              data: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1234 },
                  name: { type: 'string', example: 'João Silva' },
                  phone: { type: 'string', example: '1133330000' },
                  cellPhone: { type: 'string', example: '11988880000' },
                  whatsapp: { type: 'string', example: '11988880000' },
                  isWhatsapp: { type: 'boolean', example: true },
                  hasNumber: { type: 'boolean', example: true },
                  houseNumber: { type: 'string', example: '123' },
                  acceptTerm: { type: 'boolean', example: true },
                  email: { type: 'string', format: 'email', example: 'joao@email.com' },
                  cpf: { type: 'string', example: '12345678901' },
                  birth_date: { type: 'string', format: 'date-time' },
                  gender: {
                    type: 'object',
                    properties: {
                      value: { type: 'string', example: 'M' },
                      label: { type: 'string', example: 'Masculino' }
                    }
                  },
                  address: { type: 'string', example: 'Rua das Flores, 123' },
                  cep: { type: 'string', example: '01234-567' },
                  city: { type: 'string', example: 'São Paulo' },
                  state: { type: 'string', example: 'SP' },
                  neighborhood: { type: 'string', example: 'Centro' },
                  complement: { type: 'string', example: 'Apto 42', nullable: true },
                  isAuthenticated: { type: 'boolean', example: false },
                  created_at: { type: 'string', format: 'date-time' }
                }
              },
              activationToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
            }
          },
          PacientProfile: {
            type: 'object',
            properties: {
              pacient: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1234 },
                  name: { type: 'string', example: 'João Silva' },
                  phone: { type: 'string', example: '1133330000' },
                  cellPhone: { type: 'string', example: '11988880000' },
                  whatsapp: { type: 'string', example: '11988880000' },
                  isWhatsapp: { type: 'boolean', example: true },
                  hasNumber: { type: 'boolean', example: true },
                  houseNumber: { type: 'string', example: '123' },
                  acceptTerm: { type: 'boolean', example: true },
                  email: { type: 'string', format: 'email', example: 'joao@email.com' },
                  cpf: { type: 'string', example: '12345678901' },
                  birth_date: { type: 'string', format: 'date-time' },
                  gender: {
                    type: 'object',
                    properties: {
                      value: { type: 'string', example: 'M' },
                      label: { type: 'string', example: 'Masculino' }
                    }
                  },
                  address: { type: 'string', example: 'Rua das Flores, 123' },
                  cep: { type: 'string', example: '01234-567' },
                  city: { type: 'string', example: 'São Paulo' },
                  state: { type: 'string', example: 'SP' },
                  neighborhood: { type: 'string', example: 'Centro' },
                  complement: { type: 'string', example: 'Apto 42', nullable: true },
                  isAuthenticated: { type: 'boolean', example: false },
                  created_at: { type: 'string', format: 'date-time' }
                }
              }
            }
          },

          // Authentication schemas
          PacientAuthenticate: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: { type: 'string', format: 'email', example: 'joao@email.com' },
              password: { type: 'string', format: 'password', example: 'senha123' }
            }
          },
          AuthResponse: {
            type: 'object',
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              role: { type: 'string', example: 'pacient' }
            }
          },

          RequestPasswordReset: {
            type: 'object',
            required: ['email'],
            properties: {
              email: { type: 'string', format: 'email', example: 'usuario@email.com' }
            }
          },
          ResetPassword: {
            type: 'object',
            required: ['token', 'password'],
            properties: {
              token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
              password: { type: 'string', format: 'password', example: 'novaSenha123' }
            }
          },
          SuccessResponse: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Operação realizada com sucesso.' }
            }
          },

          // Clinic schemas
          ClinicRegister: {
            type: 'object',
            required: [
              'name', 'specialty', 'healthInsurance', 'phone', 'cellPhone', 'whatsapp',
              'hasNumber', 'houseNumber', 'acceptTerm', 'email', 'cnpj', 'password',
              'passwordConfirmation', 'address', 'cep', 'city', 'state', 'neighborhood'
            ],
            properties: {
              name: { type: 'string', example: 'Clínica Saúde Plena' },
              specialty: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    value: { type: 'string', example: 'cardiologia' },
                    label: { type: 'string', example: 'Cardiologia' }
                  }
                }
              },
              healthInsurance: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    value: { type: 'string', example: 'unimed' },
                    label: { type: 'string', example: 'Unimed' }
                  }
                }
              },
              phone: { type: 'string', example: '1133334444' },
              cellPhone: { type: 'string', example: '11988889999' },
              whatsapp: { type: 'string', example: '11988889999' },
              hasNumber: { type: 'boolean', example: true },
              houseNumber: { type: 'string', example: '1000' },
              acceptTerm: { type: 'boolean', example: true },
              email: { type: 'string', format: 'email', example: 'contato@clinica.com' },
              cnpj: { type: 'string', example: '78.653.910/0001-60' },
              password: { type: 'string', format: 'password', example: 'senha123' },
              passwordConfirmation: { type: 'string', format: 'password', example: 'senha123' },
              address: { type: 'string', example: 'Av. Paulista, 1000' },
              cep: { type: 'string', example: '01310-100' },
              city: { type: 'string', example: 'São Paulo' },
              state: { type: 'string', example: 'SP' },
              neighborhood: { type: 'string', example: 'Bela Vista' },
              complement: { type: 'string', example: 'Sala 501', nullable: true }
            }
          },
          ClinicResponse: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Clinic successfully created!' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1234 },
                  name: { type: 'string', example: 'Clínica Saúde Plena' },
                  phone: { type: 'string', example: '1133334444' },
                  cellPhone: { type: 'string', example: '11988889999' },
                  whatsapp: { type: 'string', example: '11988889999' },
                  hasNumber: { type: 'boolean', example: true },
                  houseNumber: { type: 'string', example: '1000' },
                  acceptTerm: { type: 'boolean', example: true },
                  email: { type: 'string', format: 'email', example: 'contato@clinica.com' },
                  cnpj: { type: 'string', example: '78.653.910/0001-60' },
                  address: { type: 'string', example: 'Av. Paulista, 1000' },
                  cep: { type: 'string', example: '01310-100' },
                  city: { type: 'string', example: 'São Paulo' },
                  state: { type: 'string', example: 'SP' },
                  neighborhood: { type: 'string', example: 'Bela Vista' },
                  complement: { type: 'string', example: 'Sala 501', nullable: true },
                  latitude: { type: 'number', example: -23.5505, nullable: true },
                  longitude: { type: 'number', example: -46.6333, nullable: true },
                  isAuthenticated: { type: 'boolean', example: false },
                  createdAt: { type: 'string', format: 'date-time' }
                }
              }
            }
          },

          // Medic schemas
          MedicRegister: {
            type: 'object',
            required: [
              'name', 'cpf', 'phone', 'email', 'gender', 'city', 'state', 'password',
              'specialty', 'crm', 'clinicId'
            ],
            properties: {
              name: { type: 'string', example: 'Dr. José Silva' },
              cpf: { type: 'string', example: '12345678901' },
              phone: { type: 'string', example: '1133334444' },
              email: { type: 'string', format: 'email', example: 'dr.jose@clinica.com' },
              gender: { type: 'string', example: 'Masculino' },
              city: { type: 'string', example: 'São Paulo' },
              state: { type: 'string', example: 'SP' },
              password: { type: 'string', format: 'password', example: 'senha123' },
              specialty: {
                type: 'array',
                items: {
                  type: 'string',
                  example: 'Cardiologia'
                }
              },
              crm: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    number: { type: 'string', example: '123456' },
                    state: { type: 'string', example: 'SP' }
                  }
                }
              },
              clinicId: { type: 'integer', example: 1 }
            }
          },
          MedicResponse: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1234 },
              name: { type: 'string', example: 'Dr. José Silva' },
              cpf: { type: 'string', example: '12345678901' },
              phone: { type: 'string', example: '1133334444' },
              email: { type: 'string', format: 'email', example: 'dr.jose@clinica.com' },
              gender: { type: 'string', example: 'Masculino' },
              city: { type: 'string', example: 'São Paulo' },
              state: { type: 'string', example: 'SP' },
              specialty: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    specialty: { type: 'string', example: 'Cardiologia' },
                    medicId: { type: 'integer', example: 1234 }
                  }
                }
              },
              crm: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    number: { type: 'string', example: '123456' },
                    state: { type: 'string', example: 'SP' },
                    medicId: { type: 'integer', example: 1234 }
                  }
                }
              },
              clinicId: { type: 'integer', example: 1 },
              created_at: { type: 'string', format: 'date-time' }
            }
          },

          // Error schemas
          Error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Error message' }
            }
          },
          ValidationError: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Validation error.' },
              issues: { type: 'object' }
            }
          }
        }
      },
      tags: [
        { name: 'Status', description: 'Endpoints para verificar o status da API' },
        { name: 'Pacientes', description: 'Operações relacionadas a pacientes' },
        { name: 'Clínicas', description: 'Operações relacionadas a clínicas' },
        { name: 'Médicos', description: 'Operações relacionadas a médicos' },
        { name: 'Autenticação', description: 'Endpoints para autenticação' }
      ],
      paths: {
        '/': {
          get: {
            summary: 'Verifica o status da API',
            tags: ['Status'],
            responses: {
              '200': {
                description: 'Retorna mensagem de status da API',
                content: {
                  'application/json': {
                    schema: { type: 'string', example: 'Conexão API Care4You!' }
                  }
                }
              }
            }
          }
        },
        '/pacients': {
          post: {
            summary: 'Cadastra um novo paciente',
            tags: ['Pacientes'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PacientRegister' }
                }
              }
            },
            responses: {
              '201': {
                description: 'Paciente cadastrado com sucesso',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/PacientResponse' }
                  }
                }
              },
              '400': {
                description: 'Erro de validação',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ValidationError' }
                  }
                }
              },
              '409': {
                description: 'Paciente já existe',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/pacient/session': {
          post: {
            summary: 'Autenticação de paciente',
            tags: ['Autenticação'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PacientAuthenticate' }
                }
              }
            },
            responses: {
              '200': {
                description: 'Autenticação bem-sucedida',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/AuthResponse' }
                  }
                }
              },
              '400': {
                description: 'Credenciais inválidas',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/pacient': {
          get: {
            summary: 'Obtém o perfil do paciente autenticado',
            tags: ['Pacientes'],
            security: [{ bearerAuth: [] }],
            responses: {
              '200': {
                description: 'Perfil do paciente',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/PacientProfile' }
                  }
                }
              },
              '401': {
                description: 'Não autorizado',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '409': {
                description: 'Paciente não encontrado ou dados inválidos',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/clinics': {
          post: {
            summary: 'Cadastra uma nova clínica',
            tags: ['Clínicas'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ClinicRegister' }
                }
              }
            },
            responses: {
              '201': {
                description: 'Clínica cadastrada com sucesso',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ClinicResponse' }
                  }
                }
              },
              '400': {
                description: 'Erro de validação',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ValidationError' }
                  }
                }
              },
              '409': {
                description: 'Clínica já existe',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/clinics/activate': {
          get: {
            summary: 'Ativa conta de uma clínica',
            tags: ['Clínicas'],
            parameters: [
              {
                name: 'token',
                in: 'query',
                required: true,
                schema: { type: 'string' },
                description: 'Token de ativação'
              }
            ],
            responses: {
              '200': {
                description: 'Conta da clínica ativada com sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: { type: 'string', example: 'Clinic account activated successfully.' }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Token inválido',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '401': {
                description: 'Token expirado',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '404': {
                description: 'Clínica não encontrada',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/clinics/resend-activation': {
          post: {
            summary: 'Reenvia email de ativação de uma clínica',
            tags: ['Clínicas'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                      email: { type: 'string', format: 'email', example: 'contato@clinica.com' }
                    }
                  }
                }
              }
            },
            responses: {
              '200': {
                description: 'Email de ativação reenviado com sucesso',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        message: {
                          type: 'string',
                          example: 'Activation email has been sent. Please check your inbox.'
                        }
                      }
                    }
                  }
                }
              },
              '400': {
                description: 'Erro de validação',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ValidationError' }
                  }
                }
              },
              '404': {
                description: 'Clínica não encontrada',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/auth/password/request-reset': {
          post: {
            summary: 'Solicita redefinição de senha',
            tags: ['Autenticação'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/RequestPasswordReset' }
                }
              }
            },
            responses: {
              '200': {
                description: 'Email de redefinição enviado com sucesso',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/SuccessResponse' }
                  }
                }
              },
              '400': {
                description: 'Dados de entrada inválidos',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/ValidationError' }
                  }
                }
              },
              '404': {
                description: 'Email não encontrado',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
        '/auth/password/reset-password': {
          post: {
            summary: 'Redefine a senha do usuário',
            tags: ['Autenticação'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ResetPassword' }
                }
              }
            },
            responses: {
              '200': {
                description: 'Senha atualizada com sucesso',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/SuccessResponse' }
                  }
                }
              },
              '400': {
                description: 'Token inválido ou dados de entrada incorretos',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              },
              '500': {
                description: 'Erro interno do servidor',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            }
          }
        },
      }
    }
  });

  // Register the Swagger UI
  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'none',
      deepLinking: true,
      filter: false,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  });
}