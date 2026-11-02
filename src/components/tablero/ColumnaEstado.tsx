import { cn } from "../../lib/utils";
import type { DefinicionEstado } from "../../lib/estadosPostulacion";
import type { Postulacion } from "../../types/postulacion";
import { TarjetaPostulacion } from "./TarjetaPostulacion";

interface ColumnaEstadoProps {
  estado: DefinicionEstado;
  postulaciones: Postulacion[];
}

export function ColumnaEstado({ estado, postulaciones }: ColumnaEstadoProps) {
  return (
    <section
      aria-label={estado.titulo}
      className={cn("flex min-h-[220px] flex-col rounded-xl border border-border border-t-4 bg-muted/40 p-3", estado.borde)}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={cn("size-2.5 rounded-full", estado.punto)} />
          <h2 className="text-sm font-semibold text-navy">{estado.titulo}</h2>
        </div>
        <span className="rounded-full bg-card px-2.5 py-0.5 text-xs font-semibold text-navy shadow-sm">
          {postulaciones.length}
        </span>
      </header>

      {postulaciones.length === 0 ? (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border px-4 py-8 text-center text-xs text-muted-foreground">
          {estado.vacio}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {postulaciones.map((p) => (
            <TarjetaPostulacion key={p.id} postulacion={p} />
          ))}
        </div>
      )}
    </section>
  );
}