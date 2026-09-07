import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  size: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  isFetching?: boolean;
  sizeOptions?: number[];
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  totalItems,
  size,
  onPageChange,
  onSizeChange,
  hasPrevious,
  hasNext,
  isFetching,
  sizeOptions = [10, 25, 50, 100],
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 pt-4 dark:border-slate-800/60">
      {/* Texto de metadados à esquerda no desktop */}
      <div className="order-2 text-xs font-medium text-slate-500 dark:text-slate-400 sm:order-1">
        {typeof totalItems === "number" ? (
          <span>
            Mostrando <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min((page - 1) * size + 1, totalItems)}</span> a{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{Math.min(page * size, totalItems)}</span> de{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> resultados
          </span>
        ) : (
          <span>
            Página <span className="font-semibold text-slate-700 dark:text-slate-200">{page}</span> de{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Controles do Lado Direito */}
      <div className="order-1 flex flex-wrap items-center gap-4 sm:order-2">
        {/* Seletor de Itens por Página */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Linhas por página</span>
          <Select value={String(size)} onValueChange={(v) => onSizeChange(Number(v))}>
            <SelectTrigger className="h-8 w-[70px] rounded-lg border-slate-200 bg-transparent text-xs font-medium transition-colors hover:bg-slate-50 focus:ring-1 dark:border-slate-800 dark:hover:bg-slate-800/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-lg border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-950">
              {sizeOptions.map((opt) => (
                <SelectItem key={opt} value={String(opt)} className="text-xs focus:bg-slate-100 dark:focus:bg-slate-800">
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botões de Navegação */}
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            variant="outline"
            disabled={!hasPrevious || isFetching}
            className="h-8 rounded-lg border-slate-200 px-2.5 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" /> : <ChevronLeft className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />}
            <span className="ml-1 hidden sm:inline">Anterior</span>
          </Button>

          <div className="flex h-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50/50 px-3 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
            {page} / {totalPages}
          </div>

          <Button
            size="sm"
            variant="outline"
            disabled={!hasNext || isFetching}
            className="h-8 rounded-lg border-slate-200 px-2.5 text-xs font-medium shadow-sm transition-all hover:bg-slate-50 active:scale-95 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
          >
            <span className="mr-1 hidden sm:inline">Próxima</span>
            {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
