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

// Siempre se muestra el numero del paso (1 a 5) para que el orden se lea de un
// vistazo. Que el paso este completo se indica con el color verde y una
// pequena marca en la esquina; el paso que se esta viendo va en azul oscuro.
// Una linea une cada paso con el anterior (sin tocar los circulos).
export function IndicadorPasos({ pasoActual, maxAlcanzado, desglose, onSeleccionar }: IndicadorPasosProps) {
  const estaCompleto = (i: number) => {
    const avance = desglose[PASOS[i].seccion];
    return avance.puntos >= avance.maximo;
  };

  return (
    <nav aria-label="Pasos del perfil">
      <ol className="grid grid-cols-5 pt-1">
        {PASOS.map((paso, i) => {
          const actual = i === pasoActual;
          const habilitado = i <= maxAlcanzado;
          const completo = estaCompleto(i);

          return (
            <li key={paso.id} className="relative">
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute right-[calc(50%+22px)] top-[18px] h-0.5 w-[calc(100%-44px)] -translate-y-1/2",
                    estaCompleto(i - 1) ? "bg-primary" : "bg-border"
                  )}
                />
              )}
              <button
                type="button"
                disabled={!habilitado}
                onClick={() => onSeleccionar(i)}
                aria-current={actual ? "step" : undefined}
                aria-label={`Paso ${i + 1}: ${paso.titulo}${completo ? " (completo)" : ""}`}
                className="relative flex w-full flex-col items-center gap-1.5 disabled:cursor-not-allowed"
              >
                <span
                  className={cn(
                    "relative flex size-9 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                    actual && "border-navy bg-navy text-white shadow-md",
                    !actual && completo && "border-primary bg-primary text-white",
                    !actual && !completo && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {i + 1}
                  {completo && (
                    <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-white text-primary ring-2 ring-primary">
                      <Check className="size-2.5" strokeWidth={4} />
                    </span>
                  )}
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
