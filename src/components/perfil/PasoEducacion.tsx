import { useState } from "react";
import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { TarjetaItemLista } from "./TarjetaItemLista";
import { alertarYEnfocarPrimerError, sinError } from "../../lib/formularios";
import { MAX_EDUCACIONES, NIVELES_EDUCACION } from "../../lib/opcionesPerfil";
import { hayErrores, validarEducaciones } from "../../lib/validacionPerfil";
import type { ErroresForm, FormEducacion, PropsPaso } from "../../types/perfil";

const EDUCACION_VACIA: FormEducacion = {
  institucion: "",
  titulo: "",
  nivel: "",
  fechaInicio: "",
  fechaFin: "",
};

interface PasoEducacionProps extends PropsPaso {
  inicial: FormEducacion[];
  onGuardar: (items: FormEducacion[]) => void;
}

export function PasoEducacion({ inicial, guardando, erroresServidor, onAtras, onGuardar }: PasoEducacionProps) {
  const [items, setItems] = useState<FormEducacion[]>(inicial);
  const [errores, setErrores] = useState<ErroresForm>({});

  const error = (campo: string) => errores[campo] ?? erroresServidor[campo];

  function agregar() {
    setItems((actuales) => [...actuales, { ...EDUCACION_VACIA }]);
  }

  function eliminar(indice: number) {
    setItems((actuales) => actuales.filter((_, i) => i !== indice));
    // Al borrar un registro cambian los indices, asi que los errores viejos ya no aplican.
    setErrores({});
  }

  function cambiar(indice: number, campo: keyof FormEducacion, valor: string) {
    setItems((actuales) => actuales.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));
    setErrores((actuales) => sinError(actuales, `educaciones[${indice}].${campo}`));
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos = validarEducaciones(items);
    if (hayErrores(nuevos)) {
      setErrores(nuevos);
      alertarYEnfocarPrimerError(nuevos);
      return;
    }
    onGuardar(items);
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
          Aun no has agregado estudios. Puedes continuar sin ellos, pero tu perfil quedara mas incompleto.
        </p>
      )}

      {items.map((item, i) => {
        const p = `educaciones[${i}]`;
        return (
          <TarjetaItemLista key={i} titulo={`Estudio ${i + 1}`} onEliminar={() => eliminar(i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Institucion" htmlFor={`${p}.institucion`} error={error(`${p}.institucion`)}>
                <Input
                  id={`${p}.institucion`}
                  value={item.institucion}
                  onChange={(e) => cambiar(i, "institucion", e.target.value)}
                  error={Boolean(error(`${p}.institucion`))}
                />
              </Field>
              <Field label="Titulo o programa" htmlFor={`${p}.titulo`} error={error(`${p}.titulo`)}>
                <Input
                  id={`${p}.titulo`}
                  value={item.titulo}
                  onChange={(e) => cambiar(i, "titulo", e.target.value)}
                  error={Boolean(error(`${p}.titulo`))}
                />
              </Field>
            </div>

            <Field label="Nivel de estudios" htmlFor={`${p}.nivel`} error={error(`${p}.nivel`)}>
              <Select
                id={`${p}.nivel`}
                value={item.nivel}
                onChange={(e) => cambiar(i, "nivel", e.target.value)}
                error={Boolean(error(`${p}.nivel`))}
              >
                <option value="">Selecciona una opcion</option>
                {NIVELES_EDUCACION.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fecha de inicio (opcional)" htmlFor={`${p}.fechaInicio`} error={error(`${p}.fechaInicio`)}>
                <Input
                  id={`${p}.fechaInicio`}
                  type="date"
                  value={item.fechaInicio}
                  onChange={(e) => cambiar(i, "fechaInicio", e.target.value)}
                  error={Boolean(error(`${p}.fechaInicio`))}
                />
              </Field>
              <Field
                label="Fecha de fin (vacia si sigues estudiando)"
                htmlFor={`${p}.fechaFin`}
                error={error(`${p}.fechaFin`)}
              >
                <Input
                  id={`${p}.fechaFin`}
                  type="date"
                  value={item.fechaFin}
                  onChange={(e) => cambiar(i, "fechaFin", e.target.value)}
                  error={Boolean(error(`${p}.fechaFin`))}
                />
              </Field>
            </div>
          </TarjetaItemLista>
        );
      })}

      {error("educaciones") && <p className="text-xs text-danger">{error("educaciones")}</p>}

      <Button type="button" variant="secondary" onClick={agregar} disabled={items.length >= MAX_EDUCACIONES}>
        <Plus className="size-4" />
        Agregar estudio
      </Button>

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