import { useEffect, useState } from 'react';
import { TarjetaRecomendacion } from "./recomendaciones/TarjetaRecomendacion";

import {
  obtenerRecomendaciones,
  type Recomendacion,
} from "../lib/api";

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
          {recomendaciones.map((rec, indice) => (
            <TarjetaRecomendacion key={rec.vacanteId} rec={rec} posicion={indice + 1} />
          ))}
        </div>
      )}
    </section>
  );
}
