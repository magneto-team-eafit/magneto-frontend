import { useState } from "react";
import { cn } from "../../lib/utils";
import type { DefinicionEstado } from "../../lib/estadosPostulacion";
import type { Postulacion } from "../../types/postulacion";
import { TarjetaPostulacion } from "./TarjetaPostulacion";

interface ColumnaEstadoProps {
  estado: DefinicionEstado;
  postulaciones: Postulacion[];
  onEstadoCambiado: (postulacion: Postulacion) => void;
  // Drag-and-drop: soltar una tarjeta sobre esta columna.
  onSoltar: () => void;
  onArrastrarInicio: (postulacionId: string) => void;
  onArrastrarFin: () => void;
  arrastrandoId: string | null;
}

export function ColumnaEstado({
  estado,
  postulaciones,
  onEstadoCambiado,
  onSoltar,
  onArrastrarInicio,
  onArrastrarFin,
  arrastrandoId,
}: ColumnaEstadoProps) {
  const [encima, setEncima] = useState(false);

  // Solo resaltamos/aceptamos el drop si se esta arrastrando una tarjeta que
  // no esta ya en esta columna.
  const puedeSoltar =
    arrastrandoId !== null && !postulaciones.some((p) => p.id === arrastrandoId);

  return (
    <section
      aria-label={estado.titulo}
      onDragOver={(e) => {
        if (!puedeSoltar) return;
        e.preventDefault(); // habilita el drop
        setEncima(true);
      }}
      onDragLeave={() => setEncima(false)}
      onDrop={(e) => {
        e.preventDefault();
        setEncima(false);
        if (puedeSoltar) onSoltar();
      }}
      className={cn(
        "flex min-h-[220px] flex-col rounded-xl border border-border border-t-4 bg-muted/40 p-3 transition-colors",
        estado.borde,
        encima && puedeSoltar && "bg-primary/10 ring-2 ring-primary/40"
      )}
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
          {encima && puedeSoltar ? "Suelta aquí para mover" : estado.vacio}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {postulaciones.map((p) => (
            <TarjetaPostulacion
              key={p.id}
              postulacion={p}
              onEstadoCambiado={onEstadoCambiado}
              onArrastrarInicio={onArrastrarInicio}
              onArrastrarFin={onArrastrarFin}
              arrastrando={arrastrandoId === p.id}
            />
          ))}
        </div>
      )}
    </section>
  );
}
