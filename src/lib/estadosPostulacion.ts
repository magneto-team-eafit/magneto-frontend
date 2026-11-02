// Estados del proceso de una postulacion, en el orden del tablero.
// Los codigos coinciden con los que guarda el backend en la columna "estado".

export type EstadoPostulacion = "POSTULADO" | "EN_REVISION" | "ENTREVISTA" | "DESCARTADO";

export interface DefinicionEstado {
  codigo: EstadoPostulacion;
  titulo: string;
  vacio: string; // mensaje cuando la columna no tiene postulaciones
  punto: string; // color del indicador junto al titulo
  borde: string; // color del borde superior de la columna
}

export const ESTADOS: DefinicionEstado[] = [
  {
    codigo: "POSTULADO",
    titulo: "Postulado",
    vacio: "Aquí aparecen las vacantes a las que te postulas.",
    punto: "bg-navy",
    borde: "border-t-navy",
  },
  {
    codigo: "EN_REVISION",
    titulo: "En revisión",
    vacio: "Las empresas que revisan tu perfil aparecen aquí.",
    punto: "bg-warning",
    borde: "border-t-warning",
  },
  {
    codigo: "ENTREVISTA",
    titulo: "Entrevista",
    vacio: "Las postulaciones con entrevista aparecen aquí.",
    punto: "bg-primary",
    borde: "border-t-primary",
  },
  {
    codigo: "DESCARTADO",
    titulo: "Descartado",
    vacio: "Los procesos que no avanzaron aparecen aquí.",
    punto: "bg-danger",
    borde: "border-t-danger",
  },
];