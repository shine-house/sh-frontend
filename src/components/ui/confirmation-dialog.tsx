import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "teal";
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  variant = "danger",
}) => {
  const [isPending, setIsPending] = React.useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl gap-0">
        <DialogHeader className="space-y-3 flex flex-col items-center text-center sm:items-start sm:text-left">
          {variant === "danger" && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950">
              <AlertTriangle className="h-5 w-5" />
            </div>
          )}
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              {title}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 dark:border-slate-800 pt-4 mt-5">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isPending}
            className={cn(
              "rounded-xl h-9 text-xs font-semibold px-5 text-white transition-all duration-200 gap-1.5",
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-500 dark:bg-rose-600 dark:hover:bg-rose-700"
                : "bg-teal-600 hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-700"
            )}
          >
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
