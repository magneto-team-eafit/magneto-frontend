import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";

interface TarjetaItemListaProps {
  titulo: string;
  onEliminar: () => void;
  children: ReactNode;
}

// Tarjeta de un registro de una lista (una experiencia, un estudio).
export function TarjetaItemLista({ titulo, onEliminar, children }: TarjetaItemListaProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy">{titulo}</h3>
        <Button
          type="button"
          variant="ghost"
          className="h-8 px-2 text-danger hover:bg-danger/10"
          onClick={onEliminar}
          aria-label={`Eliminar ${titulo}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}