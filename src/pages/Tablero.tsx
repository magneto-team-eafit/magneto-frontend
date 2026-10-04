import { TableroPostulaciones } from "../components/TableroPostulaciones";

export function Tablero() {
    const usuarioId = localStorage.getItem("usuarioId") ?? "";
    return <TableroPostulaciones usuarioId={usuarioId} />;
}