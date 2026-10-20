import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { alertarYEnfocarPrimerError, sinError } from "../../lib/formularios";
import { hayErrores, validarDatosPersonales } from "../../lib/validacionPerfil";
import type { ErroresForm, FormDatosPersonales, PropsPaso } from "../../types/perfil";

interface PasoDatosPersonalesProps extends PropsPaso {
  inicial: FormDatosPersonales;
  onGuardar: (datos: FormDatosPersonales) => void;
}

export function PasoDatosPersonales({ inicial, guardando, erroresServidor, onGuardar }: PasoDatosPersonalesProps) {
  const [form, setForm] = useState<FormDatosPersonales>(inicial);
  const [errores, setErrores] = useState<ErroresForm>({});

  // Muestra el error local; si no hay, el que devolvio el backend.
  const error = (campo: string) => errores[campo] ?? erroresServidor[campo];

  function cambiar(campo: keyof FormDatosPersonales, valor: string) {
    setForm((actual) => ({ ...actual, [campo]: valor }));
    setErrores((actuales) => sinError(actuales, campo));
  }

  function enviar(e: FormEvent) {
    e.preventDefault();
    const nuevos = validarDatosPersonales(form);
    if (hayErrores(nuevos)) {
      setErrores(nuevos);
      alertarYEnfocarPrimerError(nuevos);
      return;
    }
    onGuardar(form);
  }

  return (
    <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
      <Field label="Nombre completo" htmlFor="nombreCompleto" error={error("nombreCompleto")}>
        <Input
          id="nombreCompleto"
          placeholder="Nombre y apellidos"
          value={form.nombreCompleto}
          onChange={(e) => cambiar("nombreCompleto", e.target.value)}
          error={Boolean(error("nombreCompleto"))}
        />
      </Field>

      <Field label="Telefono celular" htmlFor="telefono" error={error("telefono")}>
        <Input
          id="telefono"
          type="tel"
          inputMode="tel"
          placeholder="300 123 4567"
          value={form.telefono}
          onChange={(e) => cambiar("telefono", e.target.value)}
          error={Boolean(error("telefono"))}
        />
      </Field>

      <Field label="Ubicacion" htmlFor="ubicacion" error={error("ubicacion")}>
        <Input
          id="ubicacion"
          placeholder="Ciudad, Departamento"
          value={form.ubicacion}
          onChange={(e) => cambiar("ubicacion", e.target.value)}
          error={Boolean(error("ubicacion"))}
        />
      </Field>

      <Field label="Resumen profesional" htmlFor="resumen" error={error("resumen")}>
        <Textarea
          id="resumen"
          rows={4}
          placeholder="Cuentanos brevemente sobre tu perfil y lo que buscas..."
          value={form.resumen}
          onChange={(e) => cambiar("resumen", e.target.value)}
          error={Boolean(error("resumen"))}
        />
      </Field>

      <div className="flex justify-end">
        <Button type="submit" loading={guardando}>
          Guardar y continuar
        </Button>
      </div>
    </form>
  );
}