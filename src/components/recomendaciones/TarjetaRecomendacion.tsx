import { Link } from "react-router-dom";
import { Building2, Check, MapPin } from "lucide-react";
import type { Recomendacion } from "../../lib/api";
import { cn } from "../../lib/utils";
import { BotonPostular } from "../BotonPostular";
import { Button } from "../ui/Button";

// Criterios del desglose, en este orden. Los maximos vienen del backend.
const CRITERIOS = [
  { clave: "habilidades", etiqueta: "Habilidades" },
  { clave: "palabrasClave", etiqueta: "Sector" },
  { clave: "ubicacion", etiqueta: "Ubicación" },
  { clave: "modalidad", etiqueta: "Modalidad" },
] as const;

function nivelDe(score: number) {
  if (score >= 75) return { texto: "Muy compatible", color: "text-success", trazo: "stroke-success" };
  if (score >= 50) return { texto: "Compatible", color: "text-warning", trazo: "stroke-warning" };
  return { texto: "Compatibilidad baja", color: "text-muted-foreground", trazo: "stroke-muted-foreground" };
}

function redondear(n: number): number {
  return Math.round(n * 10) / 10;
}

// Anillo con el porcentaje en el centro (SVG: un circulo de fondo y otro encima
// cuyo trazo se recorta con strokeDasharray segun el porcentaje).
function AnilloScore({ score }: { score: number }) {
  const radio = 30;
  const circunferencia = 2 * Math.PI * radio;
  const nivel = nivelDe(score);
  return (
    <div className="relative size-[76px] shrink-0" role="img" aria-label={`Compatibilidad ${score}%`}>
      <svg viewBox="0 0 76 76" className="size-full -rotate-90">
        <circle cx="38" cy="38" r={radio} fill="none" strokeWidth="7" className="stroke-border" />
        <circle
          cx="38"
          cy="38"
          r={radio}
          fill="none"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={`${(Math.min(score, 100) / 100) * circunferencia} ${circunferencia}`}
          className={nivel.trazo}
        />
      </svg>
      <span className={cn("absolute inset-0 flex items-center justify-center text-lg font-bold", nivel.color)}>
        {score}%
      </span>
    </div>
  );
}

function BarraCriterio({ etiqueta, valor, maximo }: { etiqueta: string; valor: number; maximo: number }) {
  const porcentaje = maximo > 0 ? Math.min(100, (valor / maximo) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-navy">{etiqueta}</span>
        <span className="text-muted-foreground">
          {redondear(valor)} / {maximo}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-primary" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  );
}

export function TarjetaRecomendacion({ rec, posicion }: { rec: Recomendacion; posicion: number }) {
  const nivel = nivelDe(rec.score);

  return (
    <article className="rounded-lg border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start gap-4">
        <AnilloScore score={rec.score} />

        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-semibold uppercase tracking-wide", nivel.color)}>
            #{posicion} · {nivel.texto}
          </p>
          <Link to={`/vacantes/${rec.vacanteId}`}>
            <h3 className="mt-0.5 text-lg font-semibold text-navy hover:underline">{rec.titulo}</h3>
          </Link>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Building2 className="size-3.5 shrink-0" /> {rec.empresa}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 shrink-0" /> {rec.ubicacion || "Ubicación no especificada"}
            </span>
            {rec.modalidad && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                {rec.modalidad}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-navy">¿Por qué te la recomendamos?</h4>
          <ul className="mt-2 space-y-1.5 text-sm">
            {rec.motivos.map((motivo, i) => (
              <li key={`${rec.vacanteId}-${i}`} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                <span>{motivo}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-md bg-surface p-3">
          <h4 className="text-sm font-semibold text-navy">Desglose del puntaje</h4>
          <div className="mt-2 space-y-2.5">
            {CRITERIOS.map(({ clave, etiqueta }) => (
              <BarraCriterio
                key={clave}
                etiqueta={etiqueta}
                valor={rec.desglose[clave]}
                maximo={rec.desglose.maximos[clave]}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Link to={`/vacantes/${rec.vacanteId}`} className="flex-1">
          <Button type="button" variant="secondary" className="w-full">
            Ver detalle
          </Button>
        </Link>
        <div className="flex-1">
          <BotonPostular vacanteId={rec.vacanteId} />
        </div>
      </div>
    </article>
  );
}
