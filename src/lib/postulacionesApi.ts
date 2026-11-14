// Llamadas HTTP de las postulaciones, su actividad y las notificaciones.

import { API_URL } from "./api";
import type { Postulacion, RegistroActividad, Notificacion } from "../types/postulacion";
import type { EstadoPostulacion } from "./estadosPostulacion";

export async function listarPostulaciones(usuarioId: string): Promise<Postulacion[]> {
  const respuesta = await fetch(`${API_URL}/postulaciones/${usuarioId}`);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudieron cargar tus postulaciones.");
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
    headers: { "Content-Type": "application/json" },
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
  const respuesta = await fetch(`${API_URL}/postulaciones/${postulacionId}/actividad`);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudo cargar la actividad de la postulación.");
  }
  return datos;
}

// Notificaciones del usuario. Con soloNoLeidas solo devuelve las pendientes.
export async function listarNotificaciones(
  usuarioId: string,
  soloNoLeidas = false
): Promise<Notificacion[]> {
  const query = soloNoLeidas ? "?soloNoLeidas=true" : "";
  const respuesta = await fetch(`${API_URL}/notificaciones/${usuarioId}${query}`);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudieron cargar las notificaciones.");
  }
  return datos;
}

export async function marcarNotificacionLeida(
  notificacionId: string,
  usuarioId: string
): Promise<void> {
  const respuesta = await fetch(`${API_URL}/notificaciones/${notificacionId}/leida`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuarioId }),
  });
  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => ({}));
    throw new Error(datos.error || "No se pudo marcar la notificación como leída.");
  }
}
