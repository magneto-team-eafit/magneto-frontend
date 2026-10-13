// Tipos del perfil tal como los entrega el backend (GET y PUT /perfil).
// Las fechas viajan como texto "AAAA-MM-DD", el formato de <input type="date">.

export type PasoPerfil =
  | "datos-personales"
  | "experiencia"
  | "educacion"
  | "habilidades"
  | "preferencias";

export interface Experiencia {
  empresa: string;
  cargo: string;
  descripcion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null; // null = trabajo actual
}

export interface Educacion {
  institucion: string;
  titulo: string;
  nivel: string | null;
  fechaInicio: string | null;
  fechaFin: string | null; // null = en curso
}

export interface DatosPerfil {
  id: string;
  nombreCompleto: string;
  telefono: string | null;
  ubicacion: string | null;
  resumen: string;
  modalidadPreferida: string;
  expectativaSalarial: number;
  disponibilidad: string;
  experiencias: Experiencia[];
  educaciones: Educacion[];
  habilidades: string[];
}

export type SeccionPerfil =
  | "datosPersonales"
  | "experiencia"
  | "educacion"
  | "habilidades"
  | "preferencias";

export interface AvanceSeccion {
  puntos: number;
  maximo: number;
}

export type DesgloseCompletitud = Record<SeccionPerfil, AvanceSeccion>;

// Forma unica de respuesta del backend para el perfil.
export interface RespuestaPerfil {
  perfil: DatosPerfil | null; // null si el usuario aun no tiene perfil
  completitud: number;
  desglose: DesgloseCompletitud;
}