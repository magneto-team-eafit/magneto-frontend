import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BarraCompletitud } from "../components/perfil/BarraCompletitud";
import { IndicadorPasos } from "../components/perfil/IndicadorPasos";
import { PasoDatosPersonales } from "../components/perfil/PasoDatosPersonales";
import { PasoEducacion } from "../components/perfil/PasoEducacion";
import { PasoExperiencia } from "../components/perfil/PasoExperiencia";
import { PasoHabilidades } from "../components/perfil/PasoHabilidades";
import { PasoPreferencias } from "../components/perfil/PasoPreferencias";
import {
  aFormDatosPersonales,
  aFormEducaciones,
  aFormExperiencias,
  aFormPreferencias,
} from "../lib/mapeoPerfil";
import { PASOS, indicePrimerPasoIncompleto } from "../lib/pasosPerfil";
import { ErrorApi, guardarPaso, obtenerPerfil } from "../lib/perfilApi";
import type { ErroresForm, PasoPerfil, RespuestaPerfil } from "../types/perfil";

// Pagina del perfil: coordina el wizard. Carga el perfil, decide que paso
// mostrar, guarda cada paso en el backend y actualiza la barra de completitud
// con lo que responde el backend (unica fuente del calculo).
export function Perfil() {
  const [respuesta, setRespuesta] = useState<RespuestaPerfil | null>(null);
  const [pasoActual, setPasoActual] = useState(0);
  const [maxAlcanzado, setMaxAlcanzado] = useState(0);
  const [guardando, setGuardando] = useState(false);
  const [erroresServidor, setErroresServidor] = useState<ErroresForm>({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Al entrar se trae el perfil actual. Si ya existe (edicion), se habilitan
  // todos los pasos y se abre el primero que falta por completar.
  useEffect(() => {
    async function cargar() {
      try {
        const datos = await obtenerPerfil();
        setRespuesta(datos);
        if (datos.perfil) {
          setMaxAlcanzado(PASOS.length - 1);
          setPasoActual(indicePrimerPasoIncompleto(datos.desglose));
        }
      } catch (error) {
        setErrorGeneral(error instanceof Error ? error.message : "No se pudo cargar tu perfil.");
      }
    }
    cargar();
  }, []);

  // Al cambiar de paso se vuelve al inicio de la pagina.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pasoActual]);

  function irAPaso(indice: number) {
    setPasoActual(indice);
    setErroresServidor({});
    setErrorGeneral("");
    setMensaje("");
  }

  async function guardar(paso: PasoPerfil, datos: object) {
    setGuardando(true);
    setErrorGeneral("");
    setErroresServidor({});
    setMensaje("");

    try {
      const resultado = await guardarPaso(paso, datos);
      setRespuesta(resultado);
      if (paso === "datos-personales") localStorage.removeItem("nombrePendiente");

      if (pasoActual < PASOS.length - 1) {
        const siguiente = pasoActual + 1;
        setMaxAlcanzado((actual) => Math.max(actual, siguiente));
        setPasoActual(siguiente);
      } else {
        setMensaje("Perfil guardado correctamente.");
      }
    } catch (error) {
      if (error instanceof ErrorApi) {
        setErroresServidor(error.detalles);
        setErrorGeneral(error.message);
      } else if (error instanceof Error) {
        setErrorGeneral(error.message);
      }
    } finally {
      setGuardando(false);
    }
  }

  if (!respuesta) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <p className={errorGeneral ? "text-sm text-danger" : "text-sm text-muted-foreground"}>
          {errorGeneral || "Cargando tu perfil..."}
        </p>
      </div>
    );
  }

  const { perfil, completitud, desglose } = respuesta;
  const paso = PASOS[pasoActual];
  const propsComunes = {
    guardando,
    erroresServidor,
    onAtras: pasoActual > 0 ? () => irAPaso(pasoActual - 1) : undefined,
  };

  // "key" fuerza a React a crear el formulario de cero al cambiar de paso,
  // para que tome los valores guardados mas recientes.
  function renderPaso() {
    switch (paso.id) {
      case "datos-personales":
        return (
          <PasoDatosPersonales
            key={paso.id}
            {...propsComunes}
            inicial={aFormDatosPersonales(perfil, localStorage.getItem("nombrePendiente"))}
            onGuardar={(datos) => guardar("datos-personales", datos)}
          />
        );
      case "experiencia":
        return (
          <PasoExperiencia
            key={paso.id}
            {...propsComunes}
            inicial={aFormExperiencias(perfil)}
            onGuardar={(items) => guardar("experiencia", { experiencias: items })}
          />
        );
      case "educacion":
        return (
          <PasoEducacion
            key={paso.id}
            {...propsComunes}
            inicial={aFormEducaciones(perfil)}
            onGuardar={(items) => guardar("educacion", { educaciones: items })}
          />
        );
      case "habilidades":
        return (
          <PasoHabilidades
            key={paso.id}
            {...propsComunes}
            inicial={perfil?.habilidades ?? []}
            onGuardar={(habilidades) => guardar("habilidades", { habilidades })}
          />
        );
      case "preferencias":
        return (
          <PasoPreferencias
            key={paso.id}
            {...propsComunes}
            inicial={aFormPreferencias(perfil)}
            onGuardar={(datos) => guardar("preferencias", datos)}
          />
        );
    }
  }

  return (
    <div className="min-h-screen bg-surface px-6 py-10">
      <div className="mx-auto max-w-[720px]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-navy">Tu perfil</h1>
          <p className="text-sm text-muted-foreground">
            Completa tu perfil paso a paso: asi las empresas te encuentran y te mostramos vacantes afines a ti.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <Link to="/vacantes" className="font-semibold text-primary underline underline-offset-4">
              Ver vacantes disponibles →
            </Link>
            <Link to="/recomendaciones" className="font-semibold text-primary underline underline-offset-4">
              Ver recomendaciones para mi →
            </Link>
            <Link to="/tablero" className="font-semibold text-primary underline underline-offset-4">
              Mi tablero →
            </Link>
          </p>
        </div>

        <div className="mb-6">
          <BarraCompletitud completitud={completitud} desglose={desglose} />
        </div>

        <div className="mb-6">
          <IndicadorPasos
            pasoActual={pasoActual}
            maxAlcanzado={maxAlcanzado}
            desglose={desglose}
            onSeleccionar={irAPaso}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-5 text-lg font-semibold text-navy">
            Paso {pasoActual + 1} de {PASOS.length}: {paso.titulo}
          </h2>

          {errorGeneral && (
            <p role="alert" className="mb-4 text-sm text-danger">
              {errorGeneral}
            </p>
          )}

          {renderPaso()}

          {mensaje && (
            <p className="mt-4 text-sm text-primary">
              {mensaje}{" "}
              <Link to="/vacantes" className="font-semibold underline underline-offset-4">
                Ver vacantes
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}