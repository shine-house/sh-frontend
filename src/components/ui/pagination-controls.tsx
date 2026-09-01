import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  page, totalPages, totalItems, size, onPageChange, onSizeChange,
  hasPrevious, hasNext, isFetching, sizeOptions = [10, 20, 50],
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
      <div className="flex items-center gap-2 order-2 sm:order-1">
        <Button size="sm" variant="outline" disabled={!hasPrevious || isFetching}
          className="rounded-xl h-8 text-xs font-semibold px-3"
          onClick={() => onPageChange(page - 1)}>
          Anterior
        </Button>
        <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
          Página {page} de {totalPages}{typeof totalItems === "number" ? ` • ${totalItems} itens` : ""}
        </span>
        <Button size="sm" variant="outline" disabled={!hasNext || isFetching}
          className="rounded-xl h-8 text-xs font-semibold px-3"
          onClick={() => onPageChange(page + 1)}>
          Próxima
        </Button>
      </div>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <span className="text-xs text-slate-400 font-medium">Por página</span>
        <Select value={String(size)} onValueChange={(v) => onSizeChange(Number(v))}>
          <SelectTrigger className="h-8 w-[72px] rounded-xl text-xs border-slate-200 dark:border-slate-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            {sizeOptions.map((opt) => (
              <SelectItem key={opt} value={String(opt)} className="text-xs">{opt}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};