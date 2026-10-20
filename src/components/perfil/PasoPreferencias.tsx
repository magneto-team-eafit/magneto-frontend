import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { alertarYEnfocarPrimerError, sinError } from "../../lib/formularios";
import { DISPONIBILIDADES, MODALIDADES } from "../../lib/opcionesPerfil";
import { hayErrores, validarPreferencias } from "../../lib/validacionPerfil";
import type { ErroresForm, FormPreferencias, PropsPaso } from "../../types/perfil";

// Texto que ve el usuario cuando difiere del valor que se guarda.
const ETIQUETA_DISPONIBILIDAD: Record<string, string> = {
  "1 mes": "1 mes o mas",
};

interface PasoPreferenciasProps extends PropsPaso {
  inicial: FormPreferencias;
  onGuardar: (datos: FormPreferencias) => void;
}

export function PasoPreferencias({ inicial, guardando, erroresServidor, onAtras, onGuardar }: PasoPreferenciasProps) {
  const [form, setForm] = useState<FormPreferencias>(inicial);
  const [errores, setErrores] = useState<ErroresForm>({});

  const error = (campo: string) => errores[campo] ?? erroresServidor[campo];

  function cambiar(campo: keyof FormPreferencias, valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actuales) => sinError(actuales, campo));
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos = validarPreferencias(form);
    if (hayErrores(nuevos)) {
      setErrores(nuevos);
      alertarYEnfocarPrimerError(nuevos);
      return;
    }
    onGuardar(form);
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      <Field label="Modalidad preferida" htmlFor="modalidadPreferida" error={error("modalidadPreferida")}>
        <Select
          id="modalidadPreferida"
          value={form.modalidadPreferida}
          onChange={(e) => cambiar("modalidadPreferida", e.target.value)}
          error={Boolean(error("modalidadPreferida"))}
        >
          <option value="">Selecciona una opcion</option>
          {MODALIDADES.map((modalidad) => (
            <option key={modalidad} value={modalidad}>
              {modalidad}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Aspiracion salarial mensual (COP)" htmlFor="expectativaSalarial" error={error("expectativaSalarial")}>
        <Input
          id="expectativaSalarial"
          type="text"
          inputMode="numeric"
          placeholder="3500000"
          value={form.expectativaSalarial}
          onChange={(e) => cambiar("expectativaSalarial", e.target.value)}
          error={Boolean(error("expectativaSalarial"))}
        />
      </Field>

      <Field label="Disponibilidad" htmlFor="disponibilidad" error={error("disponibilidad")}>
        <Select
          id="disponibilidad"
          value={form.disponibilidad}
          onChange={(e) => cambiar("disponibilidad", e.target.value)}
          error={Boolean(error("disponibilidad"))}
        >
          <option value="">Selecciona una opcion</option>
          {DISPONIBILIDADES.map((opcion) => (
            <option key={opcion} value={opcion}>
              {ETIQUETA_DISPONIBILIDAD[opcion] ?? opcion}
            </option>
          ))}
        </Select>
      </Field>

      <div className="flex justify-between">
        {onAtras ? (
          <Button type="button" variant="ghost" onClick={onAtras}>
            Atras
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" loading={guardando}>
          Guardar y finalizar
        </Button>
      </div>
    </form>
  );
}