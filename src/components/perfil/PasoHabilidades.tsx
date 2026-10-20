import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { alertarYEnfocarPrimerError } from "../../lib/formularios";
import { HABILIDADES_PARA_COMPLETAR, MAX_HABILIDADES } from "../../lib/opcionesPerfil";
import { hayErrores, validarHabilidades, validarNombreHabilidad } from "../../lib/validacionPerfil";
import type { PropsPaso } from "../../types/perfil";

interface PasoHabilidadesProps extends PropsPaso {
  inicial: string[];
  onGuardar: (habilidades: string[]) => void;
}

export function PasoHabilidades({ inicial, guardando, erroresServidor, onAtras, onGuardar }: PasoHabilidadesProps) {
  const [habilidades, setHabilidades] = useState<string[]>(inicial);
  const [texto, setTexto] = useState("");
  const [errorLocal, setErrorLocal] = useState<string | null>(null);

  // Cualquier error del backend sobre habilidades (de la lista o de un elemento).
  const errorServidor = Object.entries(erroresServidor).find(([campo]) => campo.startsWith("habilidades"))?.[1];
  const errorVisible = errorLocal ?? errorServidor;

  function agregar() {
    const limpio = texto.trim();
    const problema = validarNombreHabilidad(limpio);
    if (problema) {
      setErrorLocal(problema);
      return;
    }
    if (habilidades.some((h) => h.toLowerCase() === limpio.toLowerCase())) {
      setErrorLocal("Esa habilidad ya esta en tu lista.");
      return;
    }
    if (habilidades.length >= MAX_HABILIDADES) {
      setErrorLocal(`Maximo ${MAX_HABILIDADES} habilidades.`);
      return;
    }
    setHabilidades((actuales) => [...actuales, limpio]);
    setTexto("");
    setErrorLocal(null);
  }

  function quitar(indice: number) {
    setHabilidades((actuales) => actuales.filter((_, i) => i !== indice));
    setErrorLocal(null);
  }

  // Enter agrega la habilidad en lugar de enviar el formulario.
  function alPresionarTecla(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      agregar();
    }
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos = validarHabilidades(habilidades);
    if (hayErrores(nuevos)) {
      setErrorLocal(Object.values(nuevos)[0]);
      alertarYEnfocarPrimerError(nuevos);
      return;
    }
    onGuardar(habilidades);
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      <Field label="Agregar habilidad" htmlFor="habilidades" error={errorVisible}>
        <div className="flex gap-2">
          <Input
            id="habilidades"
            placeholder="Ej: React, SQL, Excel, Atencion al cliente"
            value={texto}
            onChange={(e) => {
              setTexto(e.target.value);
              setErrorLocal(null);
            }}
            onKeyDown={alPresionarTecla}
            error={Boolean(errorVisible)}
          />
          <Button type="button" variant="secondary" onClick={agregar}>
            <Plus className="size-4" />
            Agregar
          </Button>
        </div>
      </Field>

      <div>
        <p className="mb-2 text-xs text-muted-foreground">
          {habilidades.length} agregadas. Con {HABILIDADES_PARA_COMPLETAR} o mas, esta seccion cuenta completa en tu
          perfil.
        </p>

        {habilidades.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
            Aun no has agregado habilidades.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {habilidades.map((habilidad, i) => (
              <li
                key={habilidad}
                className="flex items-center gap-1.5 rounded-full bg-primary/10 py-1 pl-3 pr-1.5 text-sm text-primary"
              >
                {habilidad}
                <button
                  type="button"
                  onClick={() => quitar(i)}
                  aria-label={`Quitar ${habilidad}`}
                  className="flex size-5 items-center justify-center rounded-full hover:bg-primary/20"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between">
        {onAtras ? (
          <Button type="button" variant="ghost" onClick={onAtras}>
            Atras
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" loading={guardando}>
          Guardar y continuar
        </Button>
      </div>
    </form>
  );
}