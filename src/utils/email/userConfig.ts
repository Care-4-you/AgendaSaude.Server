import { env } from "@/env";

export const USER_CONFIG = {
  clinics: {
    activationPort: env.PORT,
    resetPort: env.PORT,
    greeting: 'clínica',
    activationPath: '/clinics/activate'
  },
  pacients: {
    activationPort: env.PORT,
    resetPort: env.PORT,
    greeting: 'paciente',
    activationPath: '/pacients/activate'
  },
  medics: {
    activationPort: env.PORT,
    resetPort: env.PORT,
    greeting: 'médico(a)',
    activationPath: '/medics/activate'
  }
} as const;