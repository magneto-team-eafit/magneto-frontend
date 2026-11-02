import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, Hourglass, MessagesSquare } from "lucide-react";
import { ColumnaEstado } from "./tablero/ColumnaEstado";
import { ESTADOS } from "../lib/estadosPostulacion";
import { listarPostulaciones } from "../lib/postulacionesApi";
import type { Postulacion } from "../types/postulacion";

interface TableroPostulacionesProps {
  usuarioId: string;
}

interface Indicador {
  etiqueta: string;
  valor: number;
  icono: typeof Briefcase;
}

export function TableroPostulaciones({ usuarioId }: TableroPostulacionesProps) {
  const [postulaciones, setPostulaciones] = useState<Postulacion[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    listarPostulaciones(usuarioId)
      .then((datos) => {
        if (activo) setPostulaciones(datos);
      })
      .catch((e) => {
        if (activo) setError(e instanceof Error ? e.message : "No se pudieron cargar tus postulaciones.");
      })
      .finally(() => {
        if (activo) setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [usuarioId]);

  const contar = (codigo: string) => postulaciones.filter((p) => p.estado === codigo).length;

  const indicadores: Indicador[] = [
    { etiqueta: "Postulaciones", valor: postulaciones.length, icono: Briefcase },
    { etiqueta: "En revisión", valor: contar("EN_REVISION"), icono: Hourglass },
    { etiqueta: "Entrevistas", valor: contar("ENTREVISTA"), icono: MessagesSquare },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">Mi tablero de postulaciones</h1>
          <p className="text-sm text-muted-foreground">Sigue en qué etapa va cada proceso de selección.</p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}