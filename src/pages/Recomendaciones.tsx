import { RecomendadoParaTi } from "../components/RecomendadoParaTi";

export function Recomendaciones() {
    const usuarioId = localStorage.getItem("usuarioId") ?? "";
    return (
        <div className="min-h-screen bg-surface px-6 py-10">
            <div className="mx-auto max-w-4xl">
                <RecomendadoParaTi usuarioId={usuarioId} />
            </div>
        </div>
    );
}