import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Hourglass, MessagesSquare, TrendingUp } from "lucide-react";
import { ColumnaEstado } from "./tablero/ColumnaEstado";
import { ESTADOS, type EstadoPostulacion } from "../lib/estadosPostulacion";
import {
  listarPostulaciones,
  obtenerResumen,
  cambiarEstadoPostulacion,
} from "../lib/postulacionesApi";
import type { Postulacion, ResumenPostulaciones } from "../types/postulacion";

interface Indicador {
  etiqueta: string;
  valor: string;
  icono: typeof Briefcase;
}

export function TableroPostulaciones() {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [resumen, setResumen] = useState<ResumenPostulaciones | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  // Postulacion que se esta arrastrando (drag-and-drop).
  const [arrastrando, setArrastrando] = useState<string | null>(null);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      const [lista, resumenDatos] = await Promise.all([listarPostulaciones(), obtenerResumen()]);
      setPostulaciones(lista);
      setResumen(resumenDatos);
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar tus postulaciones.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    // Diferido para que el setState no sea sincrono dentro del effect
    // (regla react-hooks/set-state-in-effect).
    const t = window.setTimeout(cargar, 0);
    return () => window.clearTimeout(t);
  }, []);

  // Reemplaza la postulacion por su version actualizada (nuevo estado) y
  // recalcula el resumen local, para que las tarjetas y el reporte se muevan.
  function manejarEstadoCambiado(actualizada: Postulacion) {
    setPostulaciones((prev) => {
      const siguiente = prev.map((p) => (p.id === actualizada.id ? actualizada : p));
      setResumen(calcularResumen(siguiente));
      return siguiente;
    });
  }

  // Soltar una tarjeta sobre una columna: cambia el estado via API.
  async function soltarEnColumna(estado: EstadoPostulacion) {
    const id = arrastrando;
    setArrastrando(null);
    if (!id) return;
    const actual = postulaciones.find((p) => p.id === id);
    if (!actual || actual.estado === estado) return;
    // Optimista: movemos la tarjeta ya; si falla, recargamos para revertir.
    manejarEstadoCambiado({ ...actual, estado });
    try {
      const actualizada = await cambiarEstadoPostulacion(id, estado);
      manejarEstadoCambiado(actualizada);
    } catch {
      await cargar();
    }
  }

  const indicadores: Indicador[] = [
    { etiqueta: "Postulaciones", valor: String(resumen?.total ?? postulaciones.length), icono: Briefcase },
    { etiqueta: "En revisión", valor: String(resumen?.porEstado.EN_REVISION ?? 0), icono: Hourglass },
    { etiqueta: "Entrevistas", valor: String(resumen?.porEstado.ENTREVISTA ?? 0), icono: MessagesSquare },
    { etiqueta: "Tasa de avance", valor: `${Math.round((resumen?.tasaAvance ?? 0) * 100)}%`, icono: TrendingUp },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Mi tablero de postulaciones</h1>
          <p className="text-sm text-muted-foreground">
            Sigue en qué etapa va cada proceso. Arrastra una tarjeta a otra columna para cambiar su estado.
          </p>
        </div>

        <ul className="flex flex-wrap gap-3">
          {indicadores.map(({ etiqueta, valor, icono: Icono }) => (
            <li key={etiqueta} className="flex min-w-[140px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icono className="size-4" />
              </span>
              <span className="leading-tight">
                <span className="block text-lg font-bold text-navy">{valor}</span>
                <span className="block text-xs text-muted-foreground">{etiqueta}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p role="alert" className="mb-4 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {!cargando && !error && postulaciones.length === 0 && (
        <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-navy">Aún no te has postulado a ninguna vacante</p>
            <p className="text-sm text-muted-foreground">Explora el catálogo y postúlate con un clic.</p>
          </div>
          <Link
            to="/vacantes"
            className="inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:brightness-90"
          >
            Explorar vacantes
          </Link>
        </div>
      )}

      {cargando ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ESTADOS.map((e) => (
            <div key={e.codigo} className="h-56 animate-pulse rounded-xl border border-border bg-muted/60" />
          ))}
        </div>
      ) : (
        <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ESTADOS.map((estado) => (
            <ColumnaEstado
              key={estado.codigo}
              estado={estado}
              postulaciones={postulaciones.filter((p) => p.estado === estado.codigo)}
              onEstadoCambiado={manejarEstadoCambiado}
              onSoltar={() => soltarEnColumna(estado.codigo)}
              onArrastrarInicio={setArrastrando}
              onArrastrarFin={() => setArrastrando(null)}
              arrastrandoId={arrastrando}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Recalcula el resumen a partir de la lista local (para no pedirlo al backend
// en cada cambio de estado). Mantiene la misma forma que GET /postulaciones/resumen.
function calcularResumen(postulaciones: Postulacion[]): ResumenPostulaciones {
  const porEstado = Object.fromEntries(
    ESTADOS.map((e) => [e.codigo, 0])
  ) as Record<EstadoPostulacion, number>;
  for (const p of postulaciones) {
    if (p.estado in porEstado) porEstado[p.estado as EstadoPostulacion]++;
  }
  const total = postulaciones.length;
  const avanzadas = total - porEstado.POSTULADO;
  const tasaAvance = total === 0 ? 0 : Number((avanzadas / total).toFixed(2));
  return { total, porEstado, tasaAvance };
}
