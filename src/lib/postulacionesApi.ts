// Llamadas HTTP de las postulaciones, su actividad y las notificaciones.
// Todas van autenticadas: el backend exige token y deduce el usuario del token
// (ya no se manda el usuarioId por la URL ni el cuerpo).

import { API_URL, authHeaders } from "./api";
import type {
  Postulacion,
  RegistroActividad,
  Notificacion,
  ResumenPostulaciones,
} from "../types/postulacion";
import type { EstadoPostulacion } from "./estadosPostulacion";

// Postularse a una vacante. El usuario sale del token.
export async function crearPostulacion(vacanteId: string): Promise<Postulacion> {
  const respuesta = await fetch(`${API_URL}/postulaciones`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ vacanteId }),
  });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo completar la postulación.");
  }
  return datos;
}

// Postulaciones del usuario autenticado.
export async function listarPostulaciones(): Promise<Postulacion[]> {
  const respuesta = await fetch(`${API_URL}/postulaciones`, { headers: authHeaders() });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudieron cargar tus postulaciones.");
  }
  return datos;
}

// Reporte del tablero: total, cantidad por estado y tasa de avance.
export async function obtenerResumen(): Promise<ResumenPostulaciones> {
  const respuesta = await fetch(`${API_URL}/postulaciones/resumen`, { headers: authHeaders() });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo cargar el resumen.");
  }
  return datos;
}

// Cambia el estado de una postulacion (mover la tarjeta entre columnas del
// tablero). El backend genera la notificacion y el registro de actividad.
export async function cambiarEstadoPostulacion(
  postulacionId: string,
  estado: EstadoPostulacion
): Promise<Postulacion> {
  const respuesta = await fetch(`${API_URL}/postulaciones/${postulacionId}/estado`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ estado }),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo cambiar el estado de la postulación.");
  }
  return datos;
}

// Registro de actividad (trazabilidad) de una postulacion.
export async function obtenerActividadPostulacion(
  postulacionId: string
): Promise<RegistroActividad[]> {
  const respuesta = await fetch(`${API_URL}/postulaciones/${postulacionId}/actividad`, {
    headers: authHeaders(),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo cargar la actividad de la postulación.");
  }
  return datos;
}

// Notificaciones del usuario autenticado. Con soloNoLeidas solo las pendientes.
export async function listarNotificaciones(soloNoLeidas = false): Promise<Notificacion[]> {
  const query = soloNoLeidas ? "?soloNoLeidas=true" : "";
  const respuesta = await fetch(`${API_URL}/notificaciones${query}`, { headers: authHeaders() });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudieron cargar las notificaciones.");
  }
  return datos;
}

export async function marcarNotificacionLeida(notificacionId: string): Promise<void> {
  const respuesta = await fetch(`${API_URL}/notificaciones/${notificacionId}/leida`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || "No se pudo marcar la notificación como leída.");
  }
}
