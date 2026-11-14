import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Clock3, History, Loader2, MapPin } from "lucide-react";
import type { Postulacion, RegistroActividad } from "../../types/postulacion";
import { ESTADOS, type EstadoPostulacion } from "../../lib/estadosPostulacion";
import { cambiarEstadoPostulacion, obtenerActividadPostulacion } from "../../lib/postulacionesApi";
import { cn } from "../../lib/utils";

interface TarjetaPostulacionProps {
  postulacion: Postulacion;
  // Avisa al tablero que esta postulacion cambio de estado, para moverla de columna.
  onEstadoCambiado: (postulacion: Postulacion) => void;
  // Drag-and-drop
  onArrastrarInicio: (postulacionId: string) => void;
  onArrastrarFin: () => void;
  arrastrando: boolean;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TarjetaPostulacion({
  postulacion,
  onEstadoCambiado,
  onArrastrarInicio,
  onArrastrarFin,
  arrastrando,
}: TarjetaPostulacionProps) {
  const { vacante } = postulacion;
  const inicial = vacante.empresa.trim().charAt(0).toUpperCase() || "?";

  // Estado al que se esta moviendo la tarjeta (para mostrar el spinner en el botón)
  const [cambiandoA, setCambiandoA] = useState<EstadoPostulacion | null>(null);
  const [error, setError] = useState("");

  const [mostrarActividad, setMostrarActividad] = useState(false);
  const [actividad, setActividad] = useState<RegistroActividad[]>([]);
  const [cargandoActividad, setCargandoActividad] = useState(false);
  const [errorActividad, setErrorActividad] = useState("");

  // Las demas columnas a las que se puede mover la tarjeta (todas menos la actual).
  const otrosEstados = ESTADOS.filter((e) => e.codigo !== postulacion.estado);

  async function moverA(estado: EstadoPostulacion) {
    setCambiandoA(estado);
    setError("");
    try {
      const actualizada = await cambiarEstadoPostulacion(postulacion.id, estado);
      onEstadoCambiado(actualizada);
      // Si el panel de actividad esta abierto, lo refrescamos para ver el cambio.
      if (mostrarActividad) await cargarActividad();
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar el estado.");
    } finally {
      setCambiandoA(null);
    }
  }

  async function cargarActividad() {
    setCargandoActividad(true);
    setErrorActividad("");
    try {
      setActividad(await obtenerActividadPostulacion(postulacion.id));
    } catch (e) {
      setErrorActividad(e instanceof Error ? e.message : "No se pudo cargar la actividad.");
    } finally {
      setCargandoActividad(false);
    }
  }

  async function alternarActividad() {
    const abrir = !mostrarActividad;
    setMostrarActividad(abrir);
    if (abrir && actividad.length === 0) await cargarActividad();
  }

  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", postulacion.id);
        onArrastrarInicio(postulacion.id);
      }}
      onDragEnd={onArrastrarFin}
      className={cn(
        "cursor-grab rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
        arrastrando && "opacity-50 ring-2 ring-primary/40"
      )}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-base font-bold text-navy"
        >
          {inicial}
        </span>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-navy">{vacante.titulo}</h3>
          <p className="truncate text-xs text-muted-foreground">{vacante.empresa}</p>
        </div>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5 text-xs text-muted-foreground">
        <li className="flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span className="truncate">{vacante.ubicacion}</span>
        </li>
        <li className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5 shrink-0" />
          Postulado el {formatearFecha(postulacion.createdAt)}
        </li>
      </ul>

      {/* Botones para mover la tarjeta a otro estado (otra columna del tablero) */}
      <div className="mt-3 border-t border-border pt-3">
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Mover a</p>
        <div className="flex flex-wrap gap-1.5">
          {otrosEstados.map((estado) => {
            const esteCargando = cambiandoA === estado.codigo;
            return (
              <button
                key={estado.codigo}
                type="button"
                disabled={cambiandoA !== null}
                onClick={() => moverA(estado.codigo)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-navy transition-colors",
                  "hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                )}
              >
                {esteCargando ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <span className={cn("size-2 rounded-full", estado.punto)} />
                )}
                {estado.titulo}
              </button>
            );
          })}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-[11px] text-danger">
            {error}
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium capitalize text-navy">
          {vacante.modalidad}
        </span>
        <Link
          to={`/vacantes/${postulacion.vacanteId}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
        >
          Ver vacante
          <ArrowUpRight className="size-3.5" />
        </Link>
      </div>

      {/* Registro de actividad (trazabilidad) de la postulacion */}
      <div className="mt-3 border-t border-border pt-3">
        <button
          type="button"
          onClick={alternarActividad}
          aria-expanded={mostrarActividad}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-navy"
        >
          <History className="size-3.5" />
          {mostrarActividad ? "Ocultar actividad" : "Ver actividad"}
        </button>

        {mostrarActividad && (
          <div className="mt-2">
            {cargandoActividad && (
              <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Loader2 className="size-3 animate-spin" /> Cargando actividad...
              </p>
            )}
            {errorActividad && (
              <p role="alert" className="text-[11px] text-danger">
                {errorActividad}
              </p>
            )}
            {!cargandoActividad && !errorActividad && actividad.length === 0 && (
              <p className="text-[11px] text-muted-foreground">Sin actividad todavía.</p>
            )}
            {!cargandoActividad && !errorActividad && actividad.length > 0 && (
              <ol className="flex flex-col gap-2 border-l border-border pl-3">
                {actividad.map((item) => (
                  <li key={item.id} className="text-[11px] leading-snug">
                    <span className="block text-navy">{item.descripcion}</span>
                    <span className="mt-0.5 flex items-center gap-1 text-muted-foreground">
                      <Clock3 className="size-3" />
                      {formatearFechaHora(item.createdAt)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
