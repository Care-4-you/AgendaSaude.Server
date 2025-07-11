export const USER_CONFIG = {
  clinics: {
    activationPort: 8080,
    resetPort: 3000,
    greeting: 'clínica',
    activationPath: '/clinics/activate'
  },
  pacients: {
    activationPort: 3000,
    resetPort: 3000,
    greeting: 'paciente',
    activationPath: '/pacients/activate'
  },
  medics: {
    activationPort: 3000,
    resetPort: 3000,
    greeting: 'médico(a)',
    activationPath: '/medics/activate'
  }
} as const;