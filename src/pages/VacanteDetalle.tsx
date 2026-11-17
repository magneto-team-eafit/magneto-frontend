import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Building2, MapPin, ArrowLeft, ExternalLink } from "lucide-react";
import { BotonPostular } from "../components/BotonPostular";
import { obtenerVacante, type Vacante } from "../lib/api";
import { AVISO_SALARIO_ESTIMADO, etiquetaNivel, fechaPublicacionCorta, formatearSalario } from "../lib/formatoVacante";

export function VacanteDetalle() {
    const { id } = useParams<{ id: string }>();
    const [vacante, setVacante] = useState<Vacante | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- patron de carga de datos: el estado de carga se activa al iniciar la peticion
        setLoading(true);
        setError("");
        obtenerVacante(id)
            .then(setVacante)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [id]);

    return (
        <div>
            <main className="mx-auto max-w-3xl px-6 py-8">
                <Link to="/vacantes" className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy">
                    <ArrowLeft className="size-4" /> Volver al catálogo
                </Link>

                {loading && <div className="mt-6 h-64 animate-pulse rounded-lg border border-border bg-card" />}

                {!loading && error && (
                    <p className="mt-6 text-sm text-danger">No pudimos cargar esta vacante: {error}</p>
                )}

                {!loading && !error && vacante && (
                    <div className="mt-4 rounded-lg border border-border bg-card p-6">
                        <h1 className="text-2xl font-bold text-navy">{vacante.titulo}</h1>
                        <p className="mt-1 flex items-center gap-1.5 text-muted-foreground">
                            <Building2 className="size-4" /> {vacante.empresa}
                        </p>
                        {vacante.ubicacion && (
                            <p className="mt-0.5 flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="size-4" /> {vacante.ubicacion}
                            </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-2">
                            {vacante.modalidad && (
                                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                                    {vacante.modalidad}
                                </span>
                            )}
                            {vacante.nivelExperiencia && (
                                <span className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium text-navy">
                                    {etiquetaNivel(vacante.nivelExperiencia)}
                                </span>
                            )}
                            <span className="rounded-full bg-surface border border-border px-3 py-1 text-xs font-medium text-navy">
                                {formatearSalario(vacante).texto}
                            </span>
                            {formatearSalario(vacante).estimado && (
                                <span title={AVISO_SALARIO_ESTIMADO} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                                    Salario estimado
                                </span>
                            )}
                            {fechaPublicacionCorta(vacante.fechaPublicacion) && (
                                <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                                    Publicada {fechaPublicacionCorta(vacante.fechaPublicacion)}
                                </span>
                            )}
                        </div>

                        <div className="mt-6 border-t border-border pt-4">
                            <h2 className="mb-2 text-sm font-semibold text-navy">Descripción</h2>
                            <p className="whitespace-pre-line text-sm text-muted-foreground">{vacante.descripcion}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                            <div className="w-48">
                                <BotonPostular vacanteId={vacante.id} />
                            </div>
                            {vacante.urlOriginal && (
                                <a
                                    href={vacante.urlOriginal}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy"
                                >
                                    Ver publicación original <ExternalLink className="size-3.5" />
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}