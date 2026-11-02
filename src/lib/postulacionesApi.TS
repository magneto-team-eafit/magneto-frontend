// Llamadas HTTP de las postulaciones.

import { API_URL } from "./api";
import type { Postulacion } from "../types/postulacion";

export async function listarPostulaciones(usuarioId: string): Promise<Postulacion[]> {
  const respuesta = await fetch(`${API_URL}/postulaciones/${usuarioId}`);
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || "No se pudieron cargar tus postulaciones.");
  }
  return datos;
}