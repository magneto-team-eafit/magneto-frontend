import { useState } from "react";
import { Button } from "./ui/Button";
import { crearPostulacion } from "../lib/postulacionesApi";

interface Props {
    vacanteId: string;
}

export function BotonPostular({ vacanteId }: Props) {
    const [cargando, setCargando] = useState(false);
    const [postulado, setPostulado] = useState(false);
    const [error, setError] = useState("");

    const handlePostular = async () => {
        setCargando(true);
        setError("");
        try {
            await crearPostulacion(vacanteId);
            setPostulado(true);
        } catch (e) {
            const mensaje = e instanceof Error ? e.message : "No se pudo completar la postulación.";
            // Si ya estabas postulado (409), el mensaje del backend lo deja claro.
            // Lo mostramos y marcamos como postulado para no reintentar.
            if (/ya te has postulado/i.test(mensaje)) {
                setPostulado(true);
            }
            setError(mensaje);
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
