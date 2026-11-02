import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import type { Postulacion } from "../../types/postulacion";

interface TarjetaPostulacionProps {
  postulacion: Postulacion;
}

function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

export function TarjetaPostulacion({ postulacion }: TarjetaPostulacionProps) {
  const { vacante } = postulacion;
  const inicial = vacante.empresa.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
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
    </article>
  );
}