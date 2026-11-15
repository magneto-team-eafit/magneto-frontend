import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, MapPinned, Wifi, Building2, X, SearchX } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Field } from "../components/ui/Field";
import { BotonPostular } from "../components/BotonPostular";
import { listarVacantes, type Vacante } from "../lib/api";

const TRM_USD_A_COP = 3128.65;

// Los valores van tal cual los guarda el backend; la etiqueta es lo que ve la persona.
const NIVELES = [
    { valor: "Entry level", etiqueta: "Inicial" },
    { valor: "Associate", etiqueta: "Asociado" },
    { valor: "Mid-Senior level", etiqueta: "Intermedio / Senior" },
    { valor: "Director", etiqueta: "Dirección" },
];

const MODALIDADES = [
    { valor: "", etiqueta: "Todas" },
    { valor: "remoto", etiqueta: "Remoto" },
    { valor: "presencial", etiqueta: "Presencial" },
];

function etiquetaNivel(valor: string | null): string | null {
    if (!valor) return null;
    return NIVELES.find((n) => n.valor === valor)?.etiqueta ?? valor;
}

function tiempoDesde(fecha: string | null): string | null {
    if (!fecha) return null;
    const dias = Math.floor((Date.now() - new Date(fecha).getTime()) / 86_400_000);
    if (Number.isNaN(dias) || dias < 0) return null;
    if (dias === 0) return "Hoy";
    if (dias === 1) return "Hace 1 día";
    if (dias < 30) return `Hace ${dias} días`;
    const meses = Math.floor(dias / 30);
    return meses === 1 ? "Hace 1 mes" : `Hace ${meses} meses`;
}

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

    const num = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });
    if (v.moneda === "COP" || !v.moneda) return `${formatoCOP.format(v.salarioMin)} - ${formatoCOP.format(v.salarioMax)}`;
    return `${v.moneda} ${num.format(v.salarioMin)} - ${num.format(v.salarioMax)}`;
}

export function Vacantes() {
    const [vacantes, setVacantes] = useState<Vacante[]>([]);
    const [total, setTotal] = useState(0);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    const [ubicacionInput, setUbicacionInput] = useState("");
    const [ubicacion, setUbicacion] = useState("");
    const [modalidad, setModalidad] = useState("");

    const [qInput, setQInput] = useState("");
    const [q, setQ] = useState("");
    const [nivelExperiencia, setNivelExperiencia] = useState("");
    const [salarioMinInput, setSalarioMinInput] = useState("");
    const [salarioMaxInput, setSalarioMaxInput] = useState("");
    const [salarioMin, setSalarioMin] = useState<number | undefined>(undefined);
    const [salarioMax, setSalarioMax] = useState<number | undefined>(undefined);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reintento, setReintento] = useState(0);

    // Debounce: espera 400ms despues de que el usuario deja de escribir,
    // tanto para ubicacion como para la busqueda por palabra clave y salario.
    useEffect(() => {
        const timeout = setTimeout(() => {
            setUbicacion(ubicacionInput);
            setQ(qInput);
            setSalarioMin(salarioMinInput ? Number(salarioMinInput) : undefined);
            setSalarioMax(salarioMaxInput ? Number(salarioMaxInput) : undefined);
            setPagina(1);
        }, 400);
        return () => clearTimeout(timeout);
    }, [ubicacionInput, qInput, salarioMinInput, salarioMaxInput]);

    useEffect(() => {
        let cancelado = false;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- patron de carga de datos: el estado de carga se activa al iniciar la peticion
        setLoading(true);
        setError("");

        listarVacantes({ pagina, ubicacion, modalidad, nivelExperiencia, salarioMin, salarioMax, q })
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
    }, [pagina, ubicacion, modalidad, nivelExperiencia, salarioMin, salarioMax, q, reintento]);

    const hayFiltros = Boolean(ubicacionInput || qInput || modalidad || nivelExperiencia || salarioMinInput || salarioMaxInput);

    function limpiarFiltros() {
        setUbicacionInput(""); setUbicacion("");
        setQInput(""); setQ("");
        setModalidad(""); setNivelExperiencia("");
        setSalarioMinInput(""); setSalarioMaxInput("");
        setSalarioMin(undefined); setSalarioMax(undefined);
        setPagina(1);
    }

    return (
        <div>
            <main className="mx-auto max-w-[1200px] px-6 py-8">
                <div className="flex flex-wrap items-end justify-between gap-2">
                    <div>
                        <h1 className="text-2xl font-bold text-navy">Encuentra tu próxima vacante</h1>
                        <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
                            {loading ? "Buscando…" : `${total.toLocaleString("es-CO")} vacantes encontradas`}
                        </p>
                    </div>
                    {hayFiltros && (
                        <Button type="button" variant="ghost" onClick={limpiarFiltros}>
                            <X className="size-4" /> Limpiar filtros
                        </Button>
                    )}
                </div>

                <div className="mt-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="min-w-[220px] flex-1">
                            <Field label="Ubicación" htmlFor="ubicacion">
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="ubicacion"
                                        placeholder="Ej. Medellín, Bogotá, Cali…"
                                        className="pl-9"
                                        value={ubicacionInput}
                                        onChange={(e) => setUbicacionInput(e.target.value)}
                                    />
                                </div>
                            </Field>
                        </div>

                        <div className="flex gap-2" role="group" aria-label="Modalidad">
                            {MODALIDADES.map((o) => (
                                <Button
                                    key={o.valor}
                                    type="button"
                                    variant={modalidad === o.valor ? "default" : "secondary"}
                                    onClick={() => { setModalidad(o.valor); setPagina(1); }}
                                >
                                    {o.valor === "remoto" && <Wifi className="size-4" />}
                                    {o.valor === "presencial" && <Building2 className="size-4" />}
                                    {o.etiqueta}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-4 border-t border-border pt-4">
                        <div className="min-w-[200px] flex-1">
                            <Field label="Palabra clave" htmlFor="q">
                                <div className="relative">
                                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="q"
                                        placeholder="Ej. analista de datos, contador, diseñador…"
                                        className="pl-9"
                                        value={qInput}
                                        onChange={(e) => setQInput(e.target.value)}
                                    />
                                </div>
                            </Field>
                        </div>

                        <div className="w-[200px]">
                            <Field label="Nivel de experiencia" htmlFor="nivelExperiencia">
                                <select
                                    id="nivelExperiencia"
                                    value={nivelExperiencia}
                                    onChange={(e) => { setNivelExperiencia(e.target.value); setPagina(1); }}
                                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                                >
                                    <option value="">Cualquiera</option>
                                    {NIVELES.map((n) => (
                                        <option key={n.valor} value={n.valor}>{n.etiqueta}</option>
                                    ))}
                                </select>
                            </Field>
                        </div>

                        <div className="w-[140px]">
                            <Field label="Salario mín. (COP)" htmlFor="salarioMin">
                                <Input
                                    id="salarioMin"
                                    type="number"
                                    placeholder="0"
                                    value={salarioMinInput}
                                    onChange={(e) => setSalarioMinInput(e.target.value)}
                                />
                            </Field>
                        </div>

                        <div className="w-[140px]">
                            <Field label="Salario máx. (COP)" htmlFor="salarioMax">
                                <Input
                                    id="salarioMax"
                                    type="number"
                                    placeholder="Sin tope"
                                    value={salarioMaxInput}
                                    onChange={(e) => setSalarioMaxInput(e.target.value)}
                                />
                            </Field>
                        </div>
                    </div>
                </div>

                {error && (
                    <div role="alert" className="mt-6 flex flex-col items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4">
                        <p className="text-sm text-danger">
                            No pudimos cargar las vacantes en este momento. Revisa tu conexión e inténtalo de nuevo.
                        </p>
                        <Button type="button" variant="secondary" onClick={() => setReintento((n) => n + 1)}>Reintentar</Button>
                    </div>
                )}

                {!error && loading && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-56 animate-pulse rounded-xl border border-border bg-card" />
                        ))}
                    </div>
                )}

                {!error && !loading && vacantes.length === 0 && (
                    <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
                        <SearchX className="size-10 text-muted-foreground" />
                        <p className="font-semibold text-navy">No encontramos vacantes con estos filtros</p>
                        <p className="text-sm text-muted-foreground">Prueba con otra palabra clave o amplía la ubicación.</p>
                        {hayFiltros && <Button type="button" variant="secondary" onClick={limpiarFiltros}>Limpiar filtros</Button>}
                    </div>
                )}

                {!error && !loading && vacantes.length > 0 && (
                    <>
                        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {vacantes.map((v) => {
                                const nivel = etiquetaNivel(v.nivelExperiencia);
                                const publicada = tiempoDesde(v.fechaPublicacion);
                                return (
                                    <article key={v.id} className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                                        <div className="flex items-start gap-3">
                                            <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                                                {v.empresa.trim().charAt(0).toUpperCase()}
                                            </span>
                                            <div className="min-w-0">
                                                <Link to={`/vacantes/${v.id}`}>
                                                    <h3 className="line-clamp-2 font-semibold leading-snug text-navy hover:underline">{v.titulo}</h3>
                                                </Link>
                                                <p className="mt-0.5 truncate text-sm text-muted-foreground">{v.empresa}</p>
                                            </div>
                                        </div>

                                        {v.ubicacion && (
                                            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                                                <MapPinned className="size-4 shrink-0" /> <span className="truncate">{v.ubicacion}</span>
                                            </p>
                                        )}

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {v.modalidad && (
                                                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium capitalize text-primary">{v.modalidad}</span>
                                            )}
                                            {nivel && (
                                                <span className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy">{nivel}</span>
                                            )}
                                            {publicada && (
                                                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">{publicada}</span>
                                            )}
                                        </div>

                                        <p className="mt-4 text-sm font-semibold text-navy">{formatearSalario(v)}</p>

                                        <div className="mt-auto flex gap-2 pt-4">
                                            <Link to={`/vacantes/${v.id}`} className="flex-1">
                                                <Button type="button" variant="secondary" className="w-full">Ver detalle</Button>
                                            </Link>
                                            <div className="flex-1">
                                                <BotonPostular vacanteId={v.id} />
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Button type="button" variant="secondary" disabled={pagina <= 1} onClick={() => setPagina((p) => p - 1)}>Anterior</Button>
                            <span className="text-sm text-muted-foreground">Página {pagina} de {totalPaginas.toLocaleString()}</span>
                            <Button type="button" variant="secondary" disabled={pagina >= totalPaginas} onClick={() => setPagina((p) => p + 1)}>Siguiente</Button>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}