import { useState } from "react";
import { Button } from "./ui/Button";

interface Props {
    usuarioId: string;
    vacanteId: string;
}

export function BotonPostular({ usuarioId, vacanteId }: Props) {
    const [cargando, setCargando] = useState(false);
    const [postulado, setPostulado] = useState(false);

    const handlePostular = async () => {
        setCargando(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/postulaciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ usuarioId, vacanteId }),
            });
            if (res.ok) {
                setPostulado(true);
            }
        } catch (error) {
            console.error("Error al postularse", error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <Button
            type="button"
            variant={postulado ? "secondary" : "default"}
            disabled={cargando || postulado}
            onClick={handlePostular}
            className="w-full"
        >
            {postulado ? "✓ Postulado" : cargando ? "Enviando..." : "Postularme"}
        </Button>
    );
}