// Validaciones del wizard del lado del cliente. Dan respuesta inmediata al
// usuario; el backend vuelve a validar todo. Cada funcion devuelve un mapa
// de errores por campo: si esta vacio, los datos son validos.

import type {
  ErroresForm,
  FormDatosPersonales,
  FormEducacion,
  FormExperiencia,
  FormPreferencias,
} from "../types/perfil";
import {
  DISPONIBILIDADES,
  MAX_EDUCACIONES,
  MAX_EXPERIENCIAS,
  MAX_HABILIDADES,
  MODALIDADES,
  NIVELES_EDUCACION,
  SALARIO_MAX,
  SALARIO_MIN,
} from "./opcionesPerfil";

const REGEX_NOMBRE = /^[\p{L}][\p{L}\s'.-]*$/u;
const REGEX_TELEFONO_CO = /^3\d{9}$/;
const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const UN_DIA_MS = 24 * 60 * 60 * 1000;

export function hayErrores(errores: ErroresForm): boolean {
  return Object.keys(errores).length > 0;
}

interface OpcionesTexto {
  min: number;
  max: number;
  obligatorio: boolean;
  etiqueta: string;
}

function validarTexto(valor: string, campo: string, errores: ErroresForm, o: OpcionesTexto): void {
  const limpio = valor.trim();
  if (limpio === "") {
    if (o.obligatorio) errores[campo] = `${o.etiqueta} es un campo obligatorio.`;
    return;
  }
  if (limpio.length < o.min) {
    errores[campo] = `${o.etiqueta} debe tener al menos ${o.min} caracteres.`;
  } else if (limpio.length > o.max) {
    errores[campo] = `${o.etiqueta} no puede superar ${o.max} caracteres.`;
  }
}

// Valida una fecha "AAAA-MM-DD" y devuelve el Date (o null si esta vacia o es invalida).
function validarFecha(
  valor: string,
  campo: string,
  errores: ErroresForm,
  o: { obligatoria: boolean; etiqueta: string }
): Date | null {
  if (valor === "") {
    if (o.obligatoria) errores[campo] = `${o.etiqueta} es obligatoria.`;
    return null;
  }
  if (!REGEX_FECHA.test(valor)) {
    errores[campo] = `${o.etiqueta} debe tener formato AAAA-MM-DD.`;
    return null;
  }
  const fecha = new Date(`${valor}T00:00:00.000Z`);
  if (Number.isNaN(fecha.getTime()) || fecha.toISOString().slice(0, 10) !== valor) {
    errores[campo] = `${o.etiqueta} no es una fecha valida.`;
    return null;
  }
  if (fecha.getUTCFullYear() < 1950) {
    errores[campo] = `${o.etiqueta} es demasiado antigua.`;
    return null;
  }
  // Se tolera un dia de diferencia por la zona horaria.
  if (fecha.getTime() > Date.now() + UN_DIA_MS) {
    errores[campo] = `${o.etiqueta} no puede estar en el futuro.`;
    return null;
  }
  return fecha;
}

function validarRangoFechas(inicio: Date | null, fin: Date | null, campoFin: string, errores: ErroresForm): void {
  if (inicio && fin && fin.getTime() < inicio.getTime()) {
    errores[campoFin] = "La fecha de fin no puede ser anterior a la de inicio.";
  }
}

// ---------- Paso 1: datos personales ----------

export function validarDatosPersonales(f: FormDatosPersonales): ErroresForm {
  const errores: ErroresForm = {};

  validarTexto(f.nombreCompleto, "nombreCompleto", errores, {
    min: 3, max: 100, obligatorio: true, etiqueta: "El nombre completo",
  });
  if (!errores.nombreCompleto && f.nombreCompleto.trim() !== "" && !REGEX_NOMBRE.test(f.nombreCompleto.trim())) {
    errores.nombreCompleto = "El nombre completo solo puede tener letras, espacios y . ' -";
  }

  // El telefono se normaliza igual que en el backend: sin espacios, guiones ni +57.
  const telefono = f.telefono.replace(/[\s-]/g, "").replace(/^\+?57/, "");
  if (f.telefono.trim() === "") {
    errores.telefono = "El telefono es obligatorio.";
  } else if (!REGEX_TELEFONO_CO.test(telefono)) {
    errores.telefono = "Ingresa un celular colombiano de 10 digitos que empiece por 3.";
  }

  validarTexto(f.ubicacion, "ubicacion", errores, {
    min: 2, max: 100, obligatorio: true, etiqueta: "La ubicacion",
  });
  validarTexto(f.resumen, "resumen", errores, {
    min: 20, max: 1000, obligatorio: true, etiqueta: "El resumen profesional",
  });

  return errores;
}

// ---------- Paso 2: experiencia ----------

export function validarExperiencias(lista: FormExperiencia[]): ErroresForm {
  const errores: ErroresForm = {};

  if (lista.length > MAX_EXPERIENCIAS) {
    errores.experiencias = `Maximo ${MAX_EXPERIENCIAS} experiencias.`;
    return errores;
  }

  lista.forEach((e, i) => {
    const p = `experiencias[${i}]`;
    validarTexto(e.empresa, `${p}.empresa`, errores, {
      min: 2, max: 100, obligatorio: true, etiqueta: "La empresa",
    });
    validarTexto(e.cargo, `${p}.cargo`, errores, {
      min: 2, max: 100, obligatorio: true, etiqueta: "El cargo",
    });
    validarTexto(e.descripcion, `${p}.descripcion`, errores, {
      min: 0, max: 1000, obligatorio: false, etiqueta: "La descripcion",
    });
    const inicio = validarFecha(e.fechaInicio, `${p}.fechaInicio`, errores, {
      obligatoria: true, etiqueta: "La fecha de inicio",
    });
    const fin = validarFecha(e.fechaFin, `${p}.fechaFin`, errores, {
      obligatoria: false, etiqueta: "La fecha de fin",
    });
    validarRangoFechas(inicio, fin, `${p}.fechaFin`, errores);
  });

  return errores;
}

// ---------- Paso 3: educacion ----------

export function validarEducaciones(lista: FormEducacion[]): ErroresForm {
  const errores: ErroresForm = {};

  if (lista.length > MAX_EDUCACIONES) {
    errores.educaciones = `Maximo ${MAX_EDUCACIONES} estudios.`;
    return errores;
  }

  lista.forEach((e, i) => {
    const p = `educaciones[${i}]`;
    validarTexto(e.institucion, `${p}.institucion`, errores, {
      min: 2, max: 150, obligatorio: true, etiqueta: "La institucion",
    });
    validarTexto(e.titulo, `${p}.titulo`, errores, {
      min: 2, max: 150, obligatorio: true, etiqueta: "El titulo",
    });
    if (!(NIVELES_EDUCACION as readonly string[]).includes(e.nivel)) {
      errores[`${p}.nivel`] = "Selecciona un nivel de estudios.";
    }
    const inicio = validarFecha(e.fechaInicio, `${p}.fechaInicio`, errores, {
      obligatoria: false, etiqueta: "La fecha de inicio",
    });
    const fin = validarFecha(e.fechaFin, `${p}.fechaFin`, errores, {
      obligatoria: false, etiqueta: "La fecha de fin",
    });
    validarRangoFechas(inicio, fin, `${p}.fechaFin`, errores);
  });

  return errores;
}

// ---------- Paso 4: habilidades ----------

// Valida el texto de una habilidad nueva antes de agregarla. Devuelve el
// mensaje de error, o null si es valida.
export function validarNombreHabilidad(texto: string): string | null {
  const limpio = texto.trim();
  if (limpio.length < 2) return "La habilidad debe tener al menos 2 caracteres.";
  if (limpio.length > 40) return "La habilidad no puede superar 40 caracteres.";
  return null;
}

export function validarHabilidades(habilidades: string[]): ErroresForm {
  const errores: ErroresForm = {};
  if (habilidades.length > MAX_HABILIDADES) {
    errores.habilidades = `Maximo ${MAX_HABILIDADES} habilidades.`;
  }
  return errores;
}

// ---------- Paso 5: preferencias ----------

export function validarPreferencias(f: FormPreferencias): ErroresForm {
  const errores: ErroresForm = {};

  if (!(MODALIDADES as readonly string[]).includes(f.modalidadPreferida)) {
    errores.modalidadPreferida = "Selecciona una modalidad.";
  }

  const salarioTexto = f.expectativaSalarial.trim();
  const salario = Number(salarioTexto);
  if (salarioTexto === "") {
    errores.expectativaSalarial = "La aspiracion salarial es un campo obligatorio.";
  } else if (!Number.isInteger(salario)) {
    errores.expectativaSalarial = "La aspiracion salarial debe ser un numero entero en COP.";
  } else if (salario < SALARIO_MIN || salario > SALARIO_MAX) {
    errores.expectativaSalarial =
      `La aspiracion salarial debe estar entre ${SALARIO_MIN.toLocaleString("es-CO")} y ${SALARIO_MAX.toLocaleString("es-CO")} COP.`;
  }

  if (!(DISPONIBILIDADES as readonly string[]).includes(f.disponibilidad)) {
    errores.disponibilidad = "Selecciona tu disponibilidad.";
  }

  return errores;
}