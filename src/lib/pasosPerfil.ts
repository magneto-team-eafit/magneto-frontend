// Definicion unica de los pasos del wizard: lo usan la barra de completitud,
// el indicador de pasos y la pagina del perfil. El orden del arreglo es el
// orden del wizard.

import type { DesgloseCompletitud, PasoPerfil, SeccionPerfil } from "../types/perfil";

export interface DefinicionPaso {
  id: PasoPerfil; // nombre del paso en la URL del backend
  titulo: string;
  seccion: SeccionPerfil; // seccion de completitud que alimenta este paso
}

export const PASOS: DefinicionPaso[] = [
  { id: "datos-personales", titulo: "Datos personales", seccion: "datosPersonales" },
  { id: "experiencia", titulo: "Experiencia", seccion: "experiencia" },
  { id: "educacion", titulo: "Educacion", seccion: "educacion" },
  { id: "habilidades", titulo: "Habilidades", seccion: "habilidades" },
  { id: "preferencias", titulo: "Preferencias", seccion: "preferencias" },
];

// Indice del primer paso cuya seccion aun no esta completa (0 si todo esta completo).
// Sirve para abrir el wizard donde el usuario se quedo.
export function indicePrimerPasoIncompleto(desglose: DesgloseCompletitud): number {
  const indice = PASOS.findIndex((p) => desglose[p.seccion].puntos < desglose[p.seccion].maximo);
  return indice === -1 ? 0 : indice;
}