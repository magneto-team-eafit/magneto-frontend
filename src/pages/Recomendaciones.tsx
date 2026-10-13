import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RecomendadoParaTi } from "../components/RecomendadoParaTi";
import {
  obtenerHistorialRecomendaciones,
  type EntradaHistorial,
} from "../lib/api";

export function Recomendaciones() {
  const usuarioId = localStorage.getItem("usuarioId") || "";
  const [historial, setHistorial] = useState<EntradaHistorial[]>([]);
  const [errorHistorial, setErrorHistorial] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function cargarHistorial() {
      try {
        const datos = await obtenerHistorialRecomendaciones(usuarioId);

        if (!cancelado) setHistorial(datos);
      } catch (error) {
        if (!cancelado) {
          setErrorHistorial(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el historial."
          );
        }
      }
    }

    if (usuarioId) cargarHistorial();

    return () => {
      cancelado = true;
    };
  }, [usuarioId]);

  return (
    <main className="min-h-screen bg-surface px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <header>
          <Link
            to="/dashboard"
            className="text-sm font-medium text-primary underline"
          >
            ← Volver al perfil
          </Link>

          <h1 className="mt-4 text-2xl font-bold text-navy">
            Tus recomendaciones
          </h1>
        </header>

        <RecomendadoParaTi usuarioId={usuarioId} />

        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-navy">
              Historial de recomendaciones
            </h2>
            <p className="text-sm text-muted-foreground">
              Consulta las recomendaciones guardadas anteriormente.
            </p>
          </div>

          {errorHistorial && (
            <p role="alert" className="text-sm text-danger">
              {errorHistorial}
            </p>
          )}

          {!errorHistorial && historial.length === 0 && (
            <p className="rounded-lg border border-border bg-card p-5">
              Todavía no hay recomendaciones en el historial.
            </p>
          )}

          <div className="grid gap-3">
            {historial.map((item) => (
              <article
                key={item.id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <div>
                    <h3 className="font-semibold text-navy">
                      {item.vacante.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.vacante.empresa}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(item.createdAt).toLocaleString("es-CO")}
                    </p>
                  </div>

                  <p className="text-xl font-bold text-primary">
                    {item.score}%
                  </p>
                </div>

                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
                  {item.motivos.map((motivo, index) => (
                    <li key={`${item.id}-${index}`}>{motivo}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
