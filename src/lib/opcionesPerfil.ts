// Opciones y limites del perfil. Deben coincidir con los del backend
// (src/domain/perfil/validation/validadores.ts).

export const MODALIDADES = ["Remoto", "Presencial", "Hibrido"] as const;

export const DISPONIBILIDADES = ["Inmediata", "1-2 semanas", "1 mes"] as const;

export const NIVELES_EDUCACION = [
  "Bachiller",
  "Tecnico",
  "Tecnologo",
  "Pregrado",
  "Especializacion",
  "Maestria",
  "Doctorado",
  "Otro",
] as const;

// Rango razonable de aspiracion salarial en COP.
export const SALARIO_MIN = 500000;
export const SALARIO_MAX = 100000000;

export const MAX_EXPERIENCIAS = 20;
export const MAX_EDUCACIONES = 10;
export const MAX_HABILIDADES = 30;