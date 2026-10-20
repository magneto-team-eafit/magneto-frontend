import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { PASOS } from "../../lib/pasosPerfil";
import type { DesgloseCompletitud } from "../../types/perfil";

interface IndicadorPasosProps {
  pasoActual: number; // indice del paso que se esta viendo
  maxAlcanzado: number; // indice mas lejano al que el usuario ya puede ir
  desglose: DesgloseCompletitud;
  onSeleccionar: (indice: number) => void;
}

export function IndicadorPasos({ pasoActual, maxAlcanzado, desglose, onSeleccionar }: IndicadorPasosProps) {
  return (
    <nav aria-label="Pasos del perfil">
      <ol className="grid grid-cols-5 gap-2">
        {PASOS.map((paso, i) => {
          const actual = i === pasoActual;
          const habilitado = i <= maxAlcanzado;
          const avance = desglose[paso.seccion];
          const completo = avance.puntos >= avance.maximo;

          return (
            <li key={paso.id}>
              <button
                type="button"
                disabled={!habilitado}
                onClick={() => onSeleccionar(i)}
                aria-current={actual ? "step" : undefined}
                className="flex w-full flex-col items-center gap-1.5 disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    actual && "border-primary bg-primary text-primary-foreground",
                    !actual && completo && "border-primary bg-primary/10 text-primary",
                    !actual && !completo && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {completo && !actual ? <Check className="size-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    "text-center text-[11px] leading-tight",
                    actual ? "font-semibold text-navy" : "text-muted-foreground"
                  )}
                >
                  {paso.titulo}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}