import { useState } from "react";
import type { FormEvent } from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { TarjetaItemLista } from "./TarjetaItemLista";
import { alertarYEnfocarPrimerError, sinError } from "../../lib/formularios";
import { MAX_EXPERIENCIAS } from "../../lib/opcionesPerfil";
import { hayErrores, validarExperiencias } from "../../lib/validacionPerfil";
import type { ErroresForm, FormExperiencia, PropsPaso } from "../../types/perfil";

const EXPERIENCIA_VACIA: FormExperiencia = {
  empresa: "",
  cargo: "",
  descripcion: "",
  fechaInicio: "",
  fechaFin: "",
};

interface PasoExperienciaProps extends PropsPaso {
  inicial: FormExperiencia[];
  onGuardar: (items: FormExperiencia[]) => void;
}

export function PasoExperiencia({ inicial, guardando, erroresServidor, onAtras, onGuardar }: PasoExperienciaProps) {
  const [items, setItems] = useState<FormExperiencia[]>(inicial);
  const [errores, setErrores] = useState<ErroresForm>({});

  const error = (campo: string) => errores[campo] ?? erroresServidor[campo];

  function agregar() {
    setItems((actuales) => [...actuales, { ...EXPERIENCIA_VACIA }]);
  }

  function eliminar(indice: number) {
    setItems((actuales) => actuales.filter((_, i) => i !== indice));
    // Al borrar un registro cambian los indices, asi que los errores viejos ya no aplican.
    setErrores({});
  }

  function cambiar(indice: number, campo: keyof FormExperiencia, valor: string) {
    setItems((actuales) => actuales.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));
    setErrores((actuales) => sinError(actuales, `experiencias[${indice}].${campo}`));
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos = validarExperiencias(items);
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
          Aun no has agregado experiencia laboral. Puedes continuar sin ella, pero tu perfil quedara mas incompleto.
        </p>
      )}

      {items.map((item, i) => {
        const p = `experiencias[${i}]`;
        return (
          <TarjetaItemLista key={i} titulo={`Experiencia ${i + 1}`} onEliminar={() => eliminar(i)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Empresa" htmlFor={`${p}.empresa`} error={error(`${p}.empresa`)}>
                <Input
                  id={`${p}.empresa`}
                  value={item.empresa}
                  onChange={(e) => cambiar(i, "empresa", e.target.value)}
                  error={Boolean(error(`${p}.empresa`))}
                />
              </Field>
              <Field label="Cargo" htmlFor={`${p}.cargo`} error={error(`${p}.cargo`)}>
                <Input
                  id={`${p}.cargo`}
                  value={item.cargo}
                  onChange={(e) => cambiar(i, "cargo", e.target.value)}
                  error={Boolean(error(`${p}.cargo`))}
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fecha de inicio" htmlFor={`${p}.fechaInicio`} error={error(`${p}.fechaInicio`)}>
                <Input
                  id={`${p}.fechaInicio`}
                  type="date"
                  value={item.fechaInicio}
                  onChange={(e) => cambiar(i, "fechaInicio", e.target.value)}
                  error={Boolean(error(`${p}.fechaInicio`))}
                />
              </Field>
              <Field
                label="Fecha de fin (vacia si es tu trabajo actual)"
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

            <Field label="Descripcion (opcional)" htmlFor={`${p}.descripcion`} error={error(`${p}.descripcion`)}>
              <Textarea
                id={`${p}.descripcion`}
                placeholder="Funciones y logros principales..."
                value={item.descripcion}
                onChange={(e) => cambiar(i, "descripcion", e.target.value)}
                error={Boolean(error(`${p}.descripcion`))}
              />
            </Field>
          </TarjetaItemLista>
        );
      })}

      {error("experiencias") && <p className="text-xs text-danger">{error("experiencias")}</p>}

      <Button type="button" variant="secondary" onClick={agregar} disabled={items.length >= MAX_EXPERIENCIAS}>
        <Plus className="size-4" />
        Agregar experiencia
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