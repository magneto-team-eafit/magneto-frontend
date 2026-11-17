import { cn } from "../../lib/utils";

// Marca de Atrae: un iman en herradura que forma una "A".
// Con tamanos pequenos (< 24px) se quita el punto blanco y se engrosa el
// trazo, para que no se pierda al verse tan chico.

interface MarcaProps {
  size?: number;
  className?: string;
}

export function LogoMarca({ size = 36, className }: MarcaProps) {
  const pequeno = size < 24;
  const trazo = pequeno ? 5.4 : 4.6;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      role="img"
      aria-label="Atrae"
      className={cn("shrink-0", className)}
    >
      <rect width="40" height="40" rx="10" fill="#22B955" />
      <path d="M11 31V19a9 9 0 0 1 18 0v12" fill="none" stroke="#fff" strokeWidth={trazo} />
      <path d="M11 31v-5M29 31v-5" stroke="#1E3249" strokeWidth={trazo} />
      {!pequeno && <circle cx="20" cy="22.5" r="2.6" fill="#fff" />}
    </svg>
  );
}

interface LogoProps {
  // "claro" = fondo claro (texto navy). "oscuro" = fondo navy (texto blanco).
  variante?: "claro" | "oscuro";
  // Tamano de la marca en px; el texto se escala proporcional.
  size?: number;
  // "fila" = marca a la izquierda (navbar). "columna" = marca arriba (login).
  disposicion?: "fila" | "columna";
  // Muestra la linea pequena "de Magneto".
  mostrarMagneto?: boolean;
  className?: string;
}

export function Logo({
  variante = "claro",
  size = 36,
  disposicion = "fila",
  mostrarMagneto = true,
  className,
}: LogoProps) {
  const oscuro = variante === "oscuro";
  const centrado = disposicion === "columna";
  const fuente = Math.round(size * 0.5);

  return (
    <span
      className={cn(
        "inline-flex items-center",
        centrado ? "flex-col gap-2.5" : "gap-2.5",
        className,
      )}
    >
      <LogoMarca size={size} />
      <span className={cn("leading-none", centrado && "text-center")}>
        <span
          className={cn("block font-extrabold", oscuro ? "text-white" : "text-navy")}
          style={{ fontSize: fuente, letterSpacing: "-0.045em" }}
        >
          atrae<span className="text-primary">.</span>
        </span>
        {mostrarMagneto && (
          <span
            className={cn(
              "mt-0.5 block text-[11px] font-semibold",
              oscuro ? "text-[#4ADE80]" : "text-[#15803D]",
            )}
          >
            de Magneto
          </span>
        )}
      </span>
    </span>
  );
}
