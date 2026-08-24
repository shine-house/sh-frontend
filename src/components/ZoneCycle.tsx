import React from "react";
import { useTask } from "@/context/TaskContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ZoneCycle: React.FC = () => {
  const { rooms, activeZone, reorderRooms } = useTask();

  const orderedRooms = [...rooms].sort(
    (a, b) => a.zone_cycle_position - b.zone_cycle_position
  );

  const moveRoom = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedRooms.length) return;

    const reordered = [...orderedRooms];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    try {
      await reorderRooms(reordered.map((r) => r.id));
    } catch {
      // rollback already handled by the mutation's onError
    }
  };

  return (
    <div className="space-y-8">

      {/* Seção 1: Ordem do Ciclo de Zonas */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-200">
            Ordem do Ciclo de Zonas
          </h2>
          {activeZone && (
            <Badge variant="outline" className="bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20 rounded-lg px-2.5 py-0.5 text-xs font-semibold">
              Zona atual: {activeZone.room_name}
            </Badge>
          )}
        </div>

        {/* Lista de Organização de Fila Refatorada */}
        <div className="space-y-2">
          {orderedRooms.map((room, index) => {
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
                    disabled={index === 0}
                    onClick={() => moveRoom(index, "up")}
                    title="Subir prioridade"
                  >
                    <ArrowUp className="h-4 w-4 stroke-[2.2]" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
                    disabled={index === orderedRooms.length - 1}
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
