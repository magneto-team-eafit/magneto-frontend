// Utilidades comunes de los formularios del wizard.

import type { ErroresForm } from "../types/perfil";

export const MENSAJE_CAMPOS_INVALIDOS =
  "Favor ingresar informacion valida en los campos obligatorios";

// Avisa con una alerta y ubica el cursor en el primer campo con error,
// segun su posicion en la pantalla (no segun el orden de los errores).
export function alertarYEnfocarPrimerError(errores: ErroresForm): void {
  window.alert(MENSAJE_CAMPOS_INVALIDOS);

  const campos = Object.keys(errores)
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  campos.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
  );

  campos[0]?.focus();
}

// Devuelve una copia de los errores sin el de un campo (cuando el usuario lo corrige).
export function sinError(errores: ErroresForm, campo: string): ErroresForm {
  const copia = { ...errores };
  delete copia[campo];
  return copia;
}