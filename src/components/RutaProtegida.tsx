import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface RutaProtegidaProps {
    children: ReactNode;
}

export function RutaProtegida({ children }: RutaProtegidaProps) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}