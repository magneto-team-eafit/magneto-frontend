import { useState } from "react";
import { Button } from "./ui/Button";
import { API_URL } from "../lib/api";

interface Props {
    usuarioId: string;
    vacanteId: string;
}

export function BotonPostular({ usuarioId, vacanteId }: Props) {
    const [cargando, setCargando] = useState(false);
    const [postulado, setPostulado] = useState(false);
    const [error, setError] = useState("");

    const handlePostular = async () => {
        setCargando(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/postulaciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId, vacanteId }),
            });
            const datos = await res.json().catch(() => ({}));
            if (res.ok) {
                setPostulado(true);
            } else if (res.status === 409) {
                // Ya estabas postulado: el backend devuelve un 409 con mensaje
                // claro. Lo tratamos como "ya postulado", no como un fallo.
                setPostulado(true);
                setError(datos.error || "Ya te has postulado a esta vacante.");
            } else {
                setError(datos.error || "No se pudo completar la postulación.");
            }
        } catch {
            setError("No se pudo conectar con el servidor. Inténtalo de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="w-full">
            <Button
                type="button"
                variant={postulado ? "secondary" : "default"}
                disabled={cargando || postulado}
                loading={cargando}
                onClick={handlePostular}
                className="w-full"
            >
                {postulado ? "✓ Postulado" : cargando ? "Enviando..." : "Postularme"}
            </Button>
            {error && (
                <p role="alert" className="mt-2 text-center text-xs text-muted-foreground">
                    {error}
                </p>
            )}
        </div>
    );
}
