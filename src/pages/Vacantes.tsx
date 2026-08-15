import { useEffect, useState } from "react";
import { Search, MapPin, Building2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { listarVacantes } from "../lib/api";

interface Vacante {
    id: string;
    titulo: string;
    empresa: string;
    ubicacion: string | null;
    modalidad: string | null;
    salarioMin: number | null;
    salarioMax: number | null;
    moneda: string | null;
}

const TRM_USD_A_COP = 3128.65;

const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

function formatearSalario(v: Vacante): string {
    if (!v.salarioMin || !v.salarioMax) return "Salario a convenir";

    if (v.moneda === "USD") {
        const min = v.salarioMin * TRM_USD_A_COP;
        const max = v.salarioMax * TRM_USD_A_COP;
        return `${formatoCOP.format(min)} - ${formatoCOP.format(max)}`;
    }

    // Por si algun dia el dataset trae otra moneda distinta a USD.
    return `${v.moneda ?? ""} ${v.salarioMin.toLocaleString()} - ${v.salarioMax.toLocaleString()}`;
}
export function Vacantes() {
    const [vacantes, setVacantes] = useState<Vacante[]>([]);
    const [total, setTotal] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const [ubicacionInput, setUbicacionInput] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [modalidad, setModalidad] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Debounce: espera 400ms despues de que el usuario deja de escribir.
    useEffect(() => {
        const timeout = setTimeout(() => {
            setUbicacion(ubicacionInput);
            setPagina(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [ubicacionInput]);

    useEffect(() => {
        let cancelado = false;
        setLoading(true);
        setError("");

        listarVacantes({ pagina, ubicacion, modalidad })
            .then((data) => {
                if (cancelado) return;
                setVacantes(data.vacantes);
                setTotal(data.total);
                setTotalPaginas(data.totalPaginas);
            })
            .catch((err) => {
                if (!cancelado) setError(err.message);
            })
            .finally(() => {
                if (!cancelado) setLoading(false);
            });

        return () => {
            cancelado = true;
        };
    }, [pagina, ubicacion, modalidad]);

    return (
        <div className="min-h-screen bg-surface">
            <header className="border-b border-border bg-card px-6 py-4">
        <span className="text-base font-semibold tracking-tight text-navy">
          Profile Manager · Magneto
        </span>
            </header>

            <main className="mx-auto max-w-[1200px] px-6 py-8">
                <h1 className="text-2xl font-bold text-navy">Vacantes disponibles</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    {loading ? "Buscando..." : `${total.toLocaleString()} vacantes encontradas`}
                </p>

                <div className="mt-6 flex flex-wrap items-end gap-4 rounded-lg border border-border bg-card p-4">
                    <div className="min-w-[220px] flex-1">
                        <Field label="Ubicación" htmlFor="ubicacion">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="ubicacion"
                                    placeholder="Ej. Fort Worth, TX"
                                    className="pl-9"
                                    value={ubicacionInput}
                                    onChange={(e) => setUbicacionInput(e.target.value)}
                                />
                            </div>
                        </Field>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant={modalidad === "" ? "default" : "secondary"}
                            onClick={() => { setModalidad(""); setPagina(1); }}
                        >
                            Todas
                        </Button>
                        <Button
                            type="button"
                            variant={modalidad === "remoto" ? "default" : "secondary"}
                            onClick={() => { setModalidad("remoto"); setPagina(1); }}
                        >
                            Remoto
                        </Button>
                        <Button
                            type="button"
                            variant={modalidad === "presencial" ? "default" : "secondary"}
                            onClick={() => { setModalidad("presencial"); setPagina(1); }}
                        >
                            Presencial
                        </Button>
                    </div>
                </div>

                {error && (
                    <p className="mt-6 text-sm text-danger">
                        No pudimos cargar las vacantes: {error}. Revisa que el backend esté corriendo en localhost:4000.
                    </p>
                )}

                {!error && loading && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-card" />
                        ))}
                    </div>
                )}

                {!error && !loading && vacantes.length === 0 && (
                    <p className="mt-6 text-sm text-muted-foreground">
                        No encontramos vacantes con estos filtros. Intenta con otra ubicación.
                    </p>
                )}

                {!error && !loading && vacantes.length > 0 && (
                    <>
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {vacantes.map((v) => (
                                <div key={v.id} className="rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-md">
                                    <h3 className="font-semibold text-navy">{v.titulo}</h3>
                                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                                        <Building2 className="size-3.5" /> {v.empresa}
                                    </p>
                                    {v.ubicacion && (
                                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
                                            <MapPin className="size-3.5" /> {v.ubicacion}
                                        </p>
                                    )}
                                    <div className="mt-3 flex items-center justify-between">
                                        {v.modalidad && (
                                            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {v.modalidad}
                      </span>
                                        )}
                                        <span className="text-xs font-medium text-navy">{formatearSalario(v)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={pagina <= 1}
                                onClick={() => setPagina((p) => p - 1)}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm text-muted-foreground">
                Página {pagina} de {totalPaginas.toLocaleString()}
              </span>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={pagina >= totalPaginas}
                                onClick={() => setPagina((p) => p + 1)}
                            >
                                Siguiente
                            </Button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}