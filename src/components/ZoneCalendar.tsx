import React from "react";
import { useTask } from "@/context/TaskContext";
import { format, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoneCalendarProps {
  weeks?: number;
}

const ZoneCalendar: React.FC<ZoneCalendarProps> = ({ weeks = 8 }) => {
  const { rooms, activeZone, getZoneCalendar, reorderRooms } = useTask();

  const calendar = getZoneCalendar(weeks);
  const orderedRooms = [...rooms].sort(
    (a, b) => a.zone_cycle_position - b.zone_cycle_position
  );

  const getRoomName = (roomId: string | null) =>
    rooms.find((r) => r.id === roomId)?.name ?? "Nenhuma";

  const moveRoom = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= orderedRooms.length) return;

    const reordered = [...orderedRooms];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];

    reorderRooms(reordered.map((r) => r.id));
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

      {/* Seção 2: Próximas Semanas (Cronograma/Timeline) */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3">
          Próximas Semanas
        </h2>

        {/* Lista de Agenda em Linha do Tempo */}
        <div className="space-y-2">
          {calendar.map((week, index) => {
            const isCurrent = isThisWeek(week.date);
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center justify-between p-3.5 border rounded-xl bg-white dark:bg-slate-900 transition-all duration-300",
                  isCurrent
                    ? "border-teal-500/40 bg-teal-500/5 dark:bg-teal-500/10 shadow-sm relative overflow-hidden"
                    : "border-slate-200/50 dark:border-slate-800/60 opacity-85 hover:opacity-100"
                )}
              >
                {/* Indicador lateral sutil exclusivo para a semana atual */}
                {isCurrent && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                )}

                <div className="flex items-center gap-3">
                  <div className={cn(
                    "p-2 rounded-xl shrink-0 transition-colors",
                    isCurrent
                      ? "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      : "bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500"
                  )}>
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <div className={cn(
                      "text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-200 capitalize-first",
                      isCurrent && "text-teal-900 dark:text-teal-100"
                    )}>
                      {format(week.date, "dd 'de' MMMM", { locale: ptBR })}
                    </div>
                    {isCurrent && (
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 animate-pulse mt-0.5">
                        Semana Atual
                      </span>
                    )}
                  </div>
                </div>

                <div className={cn(
                  "text-sm font-medium text-slate-600 dark:text-slate-400 px-3 py-1 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800/50",
                  isCurrent && "bg-white dark:bg-slate-900 border-teal-500/20 font-semibold text-teal-900 dark:text-teal-300"
                )}>
                  {getRoomName(week.roomId)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ZoneCalendar;
