import { PASOS } from "../../lib/pasosPerfil";
import type { DesgloseCompletitud } from "../../types/perfil";

interface BarraCompletitudProps {
  completitud: number;
  desglose: DesgloseCompletitud;
}

// Muestra los puntos con un decimal como maximo (por ejemplo 6.7).
function formatearPuntos(n: number): string {
  return String(Math.round(n * 10) / 10);
}

export function BarraCompletitud({ completitud, desglose }: BarraCompletitudProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-medium text-navy">Perfil completado</span>
        <span className="text-sm font-semibold text-primary">{completitud}%</span>
      </div>

      <div
        role="progressbar"
        aria-label="Completitud del perfil"
        aria-valuenow={completitud}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${completitud}%` }}
        />
      </div>

      <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-muted-foreground sm:grid-cols-5">
        {PASOS.map((paso) => {
          const avance = desglose[paso.seccion];
          const completa = avance.puntos >= avance.maximo;
          return (
            <li key={paso.id} className="flex flex-col">
              <span className={completa ? "font-medium text-primary" : undefined}>{paso.titulo}</span>
              <span>
                {formatearPuntos(avance.puntos)}/{avance.maximo}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}