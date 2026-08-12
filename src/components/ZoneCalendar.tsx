
import React from "react";
import { useTask } from "@/contexts/TaskContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format, isToday, isThisWeek } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface ZoneCalendarProps {
  weeks?: number;
}

const ZoneCalendar: React.FC<ZoneCalendarProps> = ({ weeks = 8 }) => {
  const { getZoneCalendar, currentZone, manuallySetCurrentZone } = useTask();
  
  const calendar = getZoneCalendar(weeks);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Calendário de Zonas</h2>
        <Badge variant="outline" className="bg-shine-teal text-primary-foreground">
          Zona atual: {currentZone?.name || "Nenhuma"}
        </Badge>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semana</TableHead>
              <TableHead>Zona</TableHead>
              <TableHead className="text-right">Ações</TableHead>
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
                <TableCell>{week.zone?.name || "Nenhuma"}</TableCell>
                <TableCell className="text-right">
                  {!isThisWeek(week.date) && week.zone && (
                    <button 
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => manuallySetCurrentZone(week.zone!.id)}
                    >
                      Definir como atual
                    </button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ZoneCalendar;
