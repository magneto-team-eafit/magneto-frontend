import { Briefcase, ChevronRight, CircleCheck, GraduationCap, Lightbulb, SlidersHorizontal, UserRound, Wrench } from "lucide-react";
import type { SeccionPerfil, SugerenciaPerfil } from "../../types/perfil";

interface PanelSugerenciasProps {
  sugerencias: SugerenciaPerfil[];
  completitud: number;
  onSeleccionar: (seccion: SeccionPerfil) => void;
}

const ICONOS: Record<SeccionPerfil, typeof Briefcase> = {
  datosPersonales: UserRound,
  experiencia: Briefcase,
  educacion: GraduationCap,
  habilidades: Wrench,
  preferencias: SlidersHorizontal,
};

// Muestra que le falta al perfil para llegar al 100 %. Cada sugerencia es un
// boton que lleva directo al paso del asistente donde se completa.
export function PanelSugerencias({ sugerencias, completitud, onSeleccionar }: PanelSugerenciasProps) {
  if (sugerencias.length === 0) {
    return (
      <div role="status" className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <CircleCheck className="size-5" />
        </span>
        <div>
          <p className="font-semibold text-navy">¡Tu perfil está completo!</p>
          <p className="text-sm text-muted-foreground">
            Las empresas ya pueden ver toda tu información y tus recomendaciones serán más precisas.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section aria-labelledby="titulo-sugerencias" className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="mb-3 flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Lightbulb className="size-5" />
        </span>
        <div>
          <h2 id="titulo-sugerencias" className="text-sm font-semibold text-navy">
            Mejora tu perfil
          </h2>
          <p className="text-xs text-muted-foreground">
            Te faltan {100 - completitud} puntos para llegar al 100 %. Empieza por lo que más suma.
          </p>
        </div>
      </header>

      <ul className="flex flex-col gap-2">
        {sugerencias.map((sugerencia) => {
          const Icono = ICONOS[sugerencia.seccion];
          return (
            <li key={sugerencia.seccion}>
              <button
                type="button"
                onClick={() => onSeleccionar(sugerencia.seccion)}
                className="group flex w-full items-center gap-3 rounded-lg border border-border bg-surface px-3 py-2.5 text-left transition-all hover:border-primary hover:bg-primary/5"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-navy/10 text-navy">
                  <Icono className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-navy">{sugerencia.titulo}</span>
                  <span className="block text-xs text-muted-foreground">{sugerencia.detalle}</span>
                </span>
                <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  +{Math.round(sugerencia.puntos)} %
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}