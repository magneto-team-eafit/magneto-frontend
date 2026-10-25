import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

// Estructura comun de las pantallas con sesion iniciada: barra de navegacion
// arriba y, debajo, la pantalla que corresponda a la ruta.
export function LayoutApp() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}