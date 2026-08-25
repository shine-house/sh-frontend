import React, { useState, useEffect } from "react";
import { useTask } from "@/context/TaskContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ZoneCycle: React.FC = () => {
  const { rooms, activeZone, reorderRooms } = useTask();

  const [localRooms, setLocalRooms] = useState([...rooms]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const sorted = [...rooms].sort(
      (a, b) => a.zone_cycle_position - b.zone_cycle_position
    );
    setLocalRooms(sorted);
  }, [rooms]);

  // Altera a ordem apenas na interface (estado local)
  const moveRoom = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localRooms.length) return;

    const reordered = [...localRooms];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    setLocalRooms(reordered);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await reorderRooms(localRooms.map((r) => r.id));
    } catch (error) {
      toast.error("Erro ao salvar ordenação!")
      console.error("Erro ao salvar ordenação:", error);
      setLocalRooms([...rooms].sort((a, b) => a.zone_cycle_position - b.zone_cycle_position));
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = JSON.stringify(localRooms.map(r => r.id)) !==
                     JSON.stringify([...rooms].sort((a, b) => a.zone_cycle_position - b.zone_cycle_position).map(r => r.id));

  return (
    <div className="space-y-8">

      {/* Seção 1: Ordem do Ciclo de Zonas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="space-y-1">
            <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-200">
              Ordem do Ciclo de Zonas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Altere a ordem e clique em salvar para aplicar.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeZone && (
              <Badge variant="outline" className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 rounded-lg px-2.5 py-0.5 text-xs font-semibold">
                Zona atual: {activeZone.room_name}
              </Badge>
            )}

            {/* Botão de Salvar Condicional */}
            <Button
              size="sm"
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={cn(
                "transition-all duration-200 gap-1.5 shadow-sm rounded-lg text-xs font-medium",
                hasChanges
                  ? "bg-teal-600 hover:bg-teal-700 text-white"
                  : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
              )}
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              {isSaving ? "Salvando..." : "Salvar ordem"}
            </Button>
          </div>
        </div>

        {/* Lista de Organização de Fila */}
        <div className="space-y-2">
          {localRooms.map((room, index) => {
            const isCurrentZone = room.id === activeZone?.room_id;
            return (
              <div
                key={room.id}
                className={cn(
                  "flex items-center justify-between p-3 border rounded-xl bg-white dark:bg-slate-900 transition-all duration-200",
                  isCurrentZone
                    ? "border-teal-500/30 bg-teal-500/[0.02] dark:bg-teal-500/[0.01] shadow-sm"
                    : "border-slate-200/60 dark:border-slate-800/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-5">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <span className={cn(
                    "text-sm font-medium text-slate-700 dark:text-slate-300",
                    isCurrentZone && "text-teal-700 dark:text-teal-400 font-semibold"
                  )}>
                    {room.name}
                  </span>
                </div>

                {/* Botões de Ação para subir/descer na fila */}
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                    disabled={index === 0 || isSaving}
                    onClick={() => moveRoom(index, "up")}
                    title="Subir prioridade"
                  >
                    <ArrowUp className="h-4 w-4 stroke-[2.2]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                    disabled={index === localRooms.length - 1 || isSaving}
                    onClick={() => moveRoom(index, "down")}
                    title="Baixar prioridade"
                  >
                    <ArrowDown className="h-4 w-4 stroke-[2.2]" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ZoneCycle;
