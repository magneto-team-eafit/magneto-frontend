import { useEffect, useRef, useState } from "react";
import { Bell, Check, Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";
import { listarNotificaciones, marcarNotificacionLeida } from "../../lib/postulacionesApi";
import type { Notificacion } from "../../types/postulacion";

function formatearFechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function CampanaNotificaciones() {
  const hasToken = Boolean(localStorage.getItem("token"));

  const [abierto, setAbierto] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const contenedorRef = useRef<HTMLDivElement>(null);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  async function cargar() {
    if (!hasToken) return;
    setCargando(true);
    setError("");
    try {
      setNotificaciones(await listarNotificaciones());
    } catch (e) {
      setError(e instanceof Error ? e.message : "No se pudieron cargar las notificaciones.");
    } finally {
      setCargando(false);
    }
  }

  // Carga inicial y refresco periodico (cada 60s) para ver cambios de estado.
  useEffect(() => {
    if (!hasToken) return;
    // Pequeño retraso (0ms) para que el setState no sea sincrono dentro del
    // effect: evita renders en cascada (regla react-hooks/set-state-in-effect).
    const inicial = window.setTimeout(cargar, 0);
    const intervalo = window.setInterval(cargar, 60_000);
    return () => {
      window.clearTimeout(inicial);
      window.clearInterval(intervalo);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken]);

  // Cerrar el panel al hacer clic fuera.
  useEffect(() => {
    function alClicFuera(evento: MouseEvent) {
      if (contenedorRef.current && !contenedorRef.current.contains(evento.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", alClicFuera);
    return () => document.removeEventListener("mousedown", alClicFuera);
  }, []);

  async function marcarLeida(notificacion: Notificacion) {
    if (notificacion.leida) return;
    // Optimista: la marcamos leida de inmediato y revertimos si falla.
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === notificacion.id ? { ...n, leida: true } : n))
    );
    try {
      await marcarNotificacionLeida(notificacion.id);
    } catch {
      setNotificaciones((prev) =>
        prev.map((n) => (n.id === notificacion.id ? { ...n, leida: false } : n))
      );
    }
  }

  async function marcarTodas() {
    const pendientes = notificaciones.filter((n) => !n.leida);
    if (pendientes.length === 0) return;
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
    await Promise.allSettled(pendientes.map((n) => marcarNotificacionLeida(n.id)));
  }

  return (
    <div ref={contenedorRef} className="relative">
      <button
        type="button"
        aria-label={`Notificaciones${noLeidas > 0 ? ` (${noLeidas} sin leer)` : ""}`}
        onClick={() => setAbierto((v) => !v)}
        className="relative inline-flex size-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
      >
        <Bell className="size-5" />
        {noLeidas > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-[18px] text-white">
            {noLeidas > 9 ? "9+" : noLeidas}
          </span>
        )}
      </button>

      {abierto && (
        <div className="absolute right-0 top-12 z-40 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-navy">Notificaciones</h3>
            {noLeidas > 0 && (
              <button
                type="button"
                onClick={marcarTodas}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                <Check className="size-3.5" />
                Marcar todas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cargando && notificaciones.length === 0 && (
              <p className="flex items-center justify-center gap-1.5 px-4 py-6 text-xs text-muted-foreground">
                <Loader2 className="size-3.5 animate-spin" /> Cargando...
              </p>
            )}
            {error && (
              <p role="alert" className="px-4 py-6 text-center text-xs text-danger">
                {error}
              </p>
            )}
            {!cargando && !error && notificaciones.length === 0 && (
              <p className="px-4 py-8 text-center text-xs text-muted-foreground">
                No tienes notificaciones.
              </p>
            )}
            <ul>
              {notificaciones.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => marcarLeida(n)}
                    className={cn(
                      "flex w-full gap-2 border-b border-border px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-muted/60",
                      !n.leida && "bg-primary/5"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-1 size-2 shrink-0 rounded-full",
                        n.leida ? "bg-transparent" : "bg-primary"
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold text-navy">{n.titulo}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{n.mensaje}</span>
                      <span className="mt-1 block text-[10px] text-muted-foreground">
                        {formatearFechaHora(n.createdAt)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
