import { useEffect, useState } from 'react';

interface DesgloseScore {
  ubicacionScore: number;
  modalidadScore: number;
  palabrasClaveScore: number;
}

interface Recomendacion {
  vacanteId: string;
  titulo: string;
  empresa: string;
  ubicacion: string | null;
  modalidad: string | null;
  score: number;
  desglose: DesgloseScore;
}

export function RecomendadoParaTi({ usuarioId }: { usuarioId: string }) {
  const [recomendaciones, setRecomendaciones] = useState<Recomendacion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/recomendaciones/${usuarioId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al cargar las recomendaciones');
        return res.json();
      })
      .then((data: Recomendacion[]) => {
        setRecomendaciones(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [usuarioId]);

  if (loading) {
    return (
      <div className="p-6 bg-card border border-border rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground animate-pulse font-medium">
          Calculando las mejores vacantes para ti...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-card border border-danger/20 rounded-lg text-danger text-sm">
        Ocurrió un error al cargar tus recomendaciones: {error}
      </div>
    );
  }

  return (
    <section className="space-y-4">
      {/* Encabezado de la sección */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Recomendado para ti</h2>
          <p className="text-sm text-muted-foreground">
            Basado en tu ubicación, modalidad e historial profesional
          </p>
        </div>
        <span className="px-3 py-1 bg-surface border border-border text-xs font-semibold text-navy rounded-full">
          {recomendaciones.length} Coincidencias
        </span>
      </div>

      {/* Lista de Recomendaciones */}
      {recomendaciones.length === 0 ? (
        <div className="p-8 bg-card border border-border rounded-lg text-center">
          <p className="text-muted-foreground">
            No encontramos recomendaciones disponibles por ahora. Intenta completar más tu perfil.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {recomendaciones.map((rec) => (
            <article
              key={rec.vacanteId}
              className="p-5 bg-card border border-border rounded-lg shadow-sm hover:border-primary/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Información principal de la vacante */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-navy leading-tight">
                    {rec.titulo}
                  </h3>
                </div>

                <p className="text-sm font-medium text-muted-foreground">
                  {rec.empresa}
                </p>

                {/* Etiquetas de datos */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
                  <span className="px-2 py-0.5 bg-surface border border-border rounded font-medium">
                   {rec.ubicacion || 'No especificada'}
                  </span>
                  <span className="px-2 py-0.5 bg-surface border border-border rounded font-medium">
                    {rec.modalidad || 'No especificada'}
                  </span>
                </div>
              </div>

              {/* Lado derecho: Porcentaje y desglose del scoring */}
              <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border gap-3 min-w-[160px]">
                <div className="text-right">
                  <span className="text-2xl font-extrabold text-primary">
                    {rec.score}%
                  </span>
                  <span className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Compatibilidad
                  </span>
                </div>

                {/* Micro-desglose del motor de scoring */}
                <div className="flex gap-1.5 text-[10px] font-medium text-navy bg-surface p-1.5 rounded border border-border">
                  <span title="Score por Ubicación" className="px-1">
                    {rec.desglose.ubicacionScore}pts
                  </span>
                  <span className="text-border">|</span>
                  <span title="Score por Modalidad" className="px-1">
                    {rec.desglose.modalidadScore}pts
                  </span>
                  <span className="text-border">|</span>
                  <span title="Score por Palabras Clave" className="px-1">
                    {rec.desglose.palabrasClaveScore}pts
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
