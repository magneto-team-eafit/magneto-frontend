// Postulacion tal como la devuelve el backend (GET /postulaciones).

import type { EstadoPostulacion } from "../lib/estadosPostulacion";

export interface VacantePostulada {
  id: string;
  titulo: string;
  empresa: string;
  ubicacion: string;
  modalidad: string;
  nivelExperiencia: string | null;
}

export interface Postulacion {
  id: string;
  estado: EstadoPostulacion;
  createdAt: string;
  vacanteId: string;
  vacante: VacantePostulada;
}

// Registro de actividad (trazabilidad) de una postulacion:
// GET /postulaciones/:id/actividad
export interface RegistroActividad {
  id: string;
  postulacionId: string;
  tipo: string; // "CAMBIO_ESTADO", "POSTULACION_CREADA"
  estadoAnterior: string | null;
  estadoNuevo: string | null;
  descripcion: string;
  createdAt: string;
}

// Notificacion dirigida al usuario: GET /notificaciones
export interface Notificacion {
  id: string;
  usuarioId: string;
  tipo: string; // "ESTADO_POSTULACION"
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

// Reporte del tablero: GET /postulaciones/resumen
export interface ResumenPostulaciones {
  total: number;
  porEstado: Record<EstadoPostulacion, number>;
  tasaAvance: number; // entre 0 y 1
}
