// Llamadas HTTP del perfil. Reutiliza la URL base y la cabecera de
// autenticacion de api.ts y devuelve los tipos de types/perfil.ts.

import { API_URL, authHeaders } from "./api";
import type { PasoPerfil, RespuestaPerfil } from "../types/perfil";

// Error de la API. "detalles" trae el mensaje de cada campo invalido
// (por ejemplo "experiencias[0].fechaFin") cuando el backend responde 400,
// para poder mostrarlo junto al campo correcto.
export class ErrorApi extends Error {
  readonly detalles: Record<string, string>;

  constructor(mensaje: string, detalles: Record<string, string> = {}) {
    super(mensaje);
    this.name = "ErrorApi";
    this.detalles = detalles;
  }
}

export async function obtenerPerfil(): Promise<RespuestaPerfil> {
  const respuesta = await fetch(`${API_URL}/perfil`, {
    headers: authHeaders(),
  });
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new ErrorApi(datos.error || "Error al obtener el perfil", datos.detalles);
  }
  return datos;
}

// Guarda un paso del wizard. El mismo metodo sirve para editar despues.
export async function guardarPaso(paso: PasoPerfil, datos: object): Promise<RespuestaPerfil> {
  const respuesta = await fetch(`${API_URL}/perfil/paso/${paso}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(datos),
  });
  const resultado = await respuesta.json();
  if (!respuesta.ok) {
    throw new ErrorApi(resultado.error || "Error al guardar el paso", resultado.detalles);
  }
  return resultado;
}