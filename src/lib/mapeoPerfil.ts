// Convierte el perfil del backend en el estado inicial de cada formulario del wizard.
// El backend usa null para "sin dato"; los inputs HTML usan "".

import type {
  DatosPerfil,
  FormDatosPersonales,
  FormEducacion,
  FormExperiencia,
  FormPreferencias,
} from "../types/perfil";

export function aFormDatosPersonales(perfil: DatosPerfil | null, nombrePendiente: string | null): FormDatosPersonales {
  return {
    // Perfil nuevo: se usa el nombre que quedo pendiente del registro.
    nombreCompleto: perfil?.nombreCompleto ?? nombrePendiente ?? "",
    telefono: perfil?.telefono ?? "",
    ubicacion: perfil?.ubicacion ?? "",
    resumen: perfil?.resumen ?? "",
  };
}

export function aFormExperiencias(perfil: DatosPerfil | null): FormExperiencia[] {
  return (perfil?.experiencias ?? []).map((e) => ({
    empresa: e.empresa,
    cargo: e.cargo,
    descripcion: e.descripcion ?? "",
    fechaInicio: e.fechaInicio ?? "",
    fechaFin: e.fechaFin ?? "",
  }));
}

export function aFormEducaciones(perfil: DatosPerfil | null): FormEducacion[] {
  return (perfil?.educaciones ?? []).map((e) => ({
    institucion: e.institucion,
    titulo: e.titulo,
    nivel: e.nivel ?? "",
    fechaInicio: e.fechaInicio ?? "",
    fechaFin: e.fechaFin ?? "",
  }));
}

export function aFormPreferencias(perfil: DatosPerfil | null): FormPreferencias {
  return {
    modalidadPreferida: perfil?.modalidadPreferida ?? "",
    expectativaSalarial: perfil && perfil.expectativaSalarial > 0 ? String(perfil.expectativaSalarial) : "",
    disponibilidad: perfil?.disponibilidad ?? "",
  };
}