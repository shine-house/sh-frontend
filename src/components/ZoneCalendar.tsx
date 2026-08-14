import React from "react";
import { useTask } from "@/context/TaskContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown } from "lucide-react";

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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Ordem do Ciclo de Zonas</h2>
          <Badge variant="outline" className="bg-shine-teal text-primary-foreground">
            Zona atual: {activeZone?.room_name ?? "Nenhuma"}
          </Badge>
        </div>

        <div className="rounded-md border divide-y">
          {orderedRooms.map((room, index) => (
            <div
              key={room.id}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground w-6">{index + 1}.</span>
                <span className={room.id === activeZone?.room_id ? "font-medium" : ""}>
                  {room.name}
                </span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === 0}
                  onClick={() => moveRoom(index, "up")}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  disabled={index === orderedRooms.length - 1}
                  onClick={() => moveRoom(index, "down")}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Próximas Semanas</h2>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Semana</TableHead>
                <TableHead>Zona</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calendar.map((week, index) => (
                <TableRow
                  key={index}
                  className={isThisWeek(week.date) ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <div className="font-medium">
                      {format(week.date, "dd 'de' MMMM", { locale: ptBR })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {isThisWeek(week.date) ? "Semana atual" : ""}
                    </div>
                  </TableCell>
                  <TableCell>{getRoomName(week.roomId)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ZoneCalendar;