// Formatos de texto de una vacante, compartidos por el listado y el detalle.
import type { Vacante } from "./api";

const TRM_USD_A_COP = 3128.65;

// Los valores van tal cual los guarda el backend; la etiqueta es lo que ve la persona.
export const NIVELES = [
    { valor: "Entry level", etiqueta: "Inicial" },
    { valor: "Associate", etiqueta: "Asociado" },
    { valor: "Mid-Senior level", etiqueta: "Intermedio / Senior" },
    { valor: "Director", etiqueta: "Dirección" },
];

export function etiquetaNivel(valor: string | null): string | null {
    if (!valor) return null;
    return NIVELES.find((n) => n.valor === valor)?.etiqueta ?? valor;
}

const formatoCOP = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
});

// 4500000 -> "$4,5 M". Si el monto no es "redondo" (1.042.000) se muestra completo.
function montoCorto(n: number): string {
    if (n >= 1_000_000 && n % 100_000 === 0) {
        return `$${(n / 1_000_000).toLocaleString("es-CO", { maximumFractionDigits: 1 })} M`;
    }
    return formatoCOP.format(n);
}

export interface SalarioFormateado {
    texto: string;
    // true = rango de referencia (la oferta no decia salario): se avisa en la interfaz
    estimado: boolean;
}

export function formatearSalario(v: Vacante): SalarioFormateado {
    if (!v.salarioMin || !v.salarioMax) return { texto: "Salario a convenir", estimado: false };

    const factor = v.moneda === "USD" ? TRM_USD_A_COP : 1;
    const min = Math.round(v.salarioMin * factor);
    const max = Math.round(v.salarioMax * factor);
    const texto = min === max ? montoCorto(min) : `${montoCorto(min)} – ${montoCorto(max)}`;
    return { texto, estimado: Boolean(v.salarioEstimado) };
}

export const AVISO_SALARIO_ESTIMADO =
    "Rango de referencia según el tipo de cargo. La oferta original no indica salario.";

// Fecha original de la oferta. El dataset solo trae dia y mes ("Publicado 12/08"),
// asi que se muestra "12 ago" sin año, tal como dice la fuente.
export function fechaPublicacionCorta(fecha: string | null): string | null {
    if (!fecha) return null;
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" }).replace(".", "");
}
