import { NavLink, useNavigate } from "react-router-dom";
import { Briefcase, KanbanSquare, LogOut, Search, Sparkles, UserRound } from "lucide-react";
import { cn } from "../../lib/utils";
import { CampanaNotificaciones } from "./CampanaNotificaciones";

interface OpcionNavegacion {
  ruta: string;
  etiqueta: string;
  icono: typeof Briefcase;
  destacada?: boolean; // la opcion principal del producto va resaltada en verde
}

const OPCIONES: OpcionNavegacion[] = [
  { ruta: "/dashboard", etiqueta: "Mi perfil", icono: UserRound },
  { ruta: "/vacantes", etiqueta: "Vacantes", icono: Search },
  { ruta: "/recomendaciones", etiqueta: "Para mí", icono: Sparkles, destacada: true },
  { ruta: "/tablero", etiqueta: "Mi tablero", icono: KanbanSquare },
];

export function Navbar() {
  const navigate = useNavigate();

  function cerrarSesion() {
    localStorage.removeItem("token");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("nombrePendiente");
    navigate("/login");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:px-6">
        <NavLink to="/dashboard" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Briefcase className="size-5" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block text-sm font-bold tracking-tight text-navy">Profile Manager</span>
            <span className="block text-[11px] font-medium text-primary">Magneto</span>
          </span>
        </NavLink>

        <nav aria-label="Navegación principal" className="flex items-center gap-1.5 sm:gap-2">
          {OPCIONES.map(({ ruta, etiqueta, icono: Icono, destacada }) => (
            <NavLink
              key={ruta}
              to={ruta}
              aria-label={etiqueta}
              className={({ isActive }) =>
                cn(
                  "inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-all md:px-4",
                  destacada
                    ? "bg-primary text-primary-foreground shadow-sm hover:opacity-90"
                    : "border border-border bg-card text-navy hover:border-primary hover:text-primary",
                  isActive && destacada && "ring-2 ring-primary/30 ring-offset-2 ring-offset-card",
                  isActive && !destacada && "border-navy bg-navy text-navy-foreground hover:border-navy hover:text-navy-foreground"
                )
              }
            >
              <Icono className="size-4" />
              <span className="hidden md:inline">{etiqueta}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <CampanaNotificaciones />
          <button
            type="button"
            onClick={cerrarSesion}
            aria-label="Cerrar sesión"
            className="inline-flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
          >
            <LogOut className="size-4" />
            <span className="hidden lg:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}