import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { BotonPostular } from "./BotonPostular";
import { Button } from "./ui/Button";

import {
  obtenerRecomendaciones,
  type Recomendacion,
} from "../lib/api";

// Criterios que se muestran en el desglose, en este orden.
const CRITERIOS = [
  { clave: "habilidades", etiqueta: "Habilidades" },
  { clave: "palabrasClave", etiqueta: "Palabras clave" },
  { clave: "ubicacion", etiqueta: "Ubicación" },
  { clave: "modalidad", etiqueta: "Modalidad" },
] as const;

function redondear(n: number): number {
  return Math.round(n * 10) / 10;
}

export function RecomendadoParaTi({
  usuarioId,
}: {
  usuarioId: string;
}) {
  const [recomendaciones, setRecomendaciones] =
    useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargar() {
      setLoading(true);
      setError("");

      try {
        const datos = await obtenerRecomendaciones(usuarioId);

        if (!cancelado) {
          setRecomendaciones(datos);
        }
      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las recomendaciones."
          );
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    if (usuarioId) {
      cargar();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sin usuario no hay peticion que dispare el estado
      setError("No se encontró el usuario de la sesión.");
      setLoading(false);
    }

    return () => {
      cancelado = true;
    };
  }, [usuarioId]);

  if (loading) {
    return <p>Calculando las mejores vacantes para ti...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-navy">
          Recomendado para ti
        </h2>
        <p className="text-sm text-muted-foreground">
          Vacantes ordenadas según su compatibilidad con tu perfil.
        </p>
      </div>

      {recomendaciones.length === 0 ? (
        <p className="rounded-lg border border-border bg-card p-6">
          No encontramos recomendaciones disponibles.
        </p>
      ) : (
        <div className="grid gap-4">
          {recomendaciones.map((rec) => (
            <article
              key={rec.vacanteId}
              className="rounded-lg border border-border bg-card p-5"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <Link to={`/vacantes/${rec.vacanteId}`}>
                    <h3 className="text-lg font-semibold text-navy hover:underline">
                      {rec.titulo}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {rec.empresa}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {rec.ubicacion || "Ubicación no especificada"} ·{" "}
                    {rec.modalidad || "Modalidad no especificada"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-2xl font-bold text-primary">
                    {rec.score}%
                  </p>
                  <p className="text-xs uppercase text-muted-foreground">
                    Compatibilidad
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-semibold">
                  ¿Por qué te recomendamos esta vacante?
                </h4>

                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                  {rec.motivos.map((motivo, index) => (
                    <li key={`${rec.vacanteId}-${index}`}>
                      {motivo}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 rounded-md bg-surface p-3">
                <h4 className="text-sm font-semibold">
                  Desglose del puntaje
                </h4>

                <ul className="mt-2 space-y-1 text-sm">
                  {CRITERIOS.map(({ clave, etiqueta }) => (
                    <li key={clave}>
                      {etiqueta}: {redondear(rec.desglose[clave])} /{" "}
                      {rec.desglose.maximos[clave]} puntos
                    </li>
                  ))}
                </ul>
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
          ))}
        </div>
      )}
    </section>
  );
}
