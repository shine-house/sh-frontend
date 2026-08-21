import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import type { RoomResponse } from "@/lib/api/types/room-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash, CalendarCheck2, Home } from "lucide-react";

interface RoomItemProps {
  room: RoomResponse;
  onSelect: (roomId: string) => void;
}

const RoomItem: React.FC<RoomItemProps> = ({ room, onSelect }) => {
  const { removeRoom, editRoom, filterTasks } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(room.name);
  const [isSaving, setIsSaving] = useState(false);

  const zoneTasks = filterTasks(room.id, "zone");
  const weeklyTasks = filterTasks(room.id, "weekly");

  const handleSave = async () => {
    if (!editedName.trim()) return;
    setIsSaving(true);
    try {
      await editRoom(room.id, { name: editedName });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (zoneTasks.length > 0 || weeklyTasks.length > 0) {
      if (!confirm(`Este cômodo tem ${zoneTasks.length + weeklyTasks.length} tarefas associadas. Deseja excluir mesmo assim?`)) {
        return;
      }
    }
    removeRoom(room.id);
  };

  return (
    <>
      <Card
        className="cursor-pointer border border-slate-200/60 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 group"
        onClick={() => onSelect(room.id)}
      >
        <CardHeader className="pb-3 pt-4 px-4">
          <div className="flex justify-between items-center gap-2">
            <CardTitle className="text-base font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {room.name}
            </CardTitle>

            <div className="flex gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-150 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditedName(room.name);
                  setIsEditing(true);
                }}
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4 pt-0 px-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800/40">
              <Home className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              {zoneTasks.length} {zoneTasks.length === 1 ? 'tarefa' : 'tarefas'} de zona
            </span>
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-2 py-1 rounded-lg border border-slate-100 dark:border-slate-800/40">
              <CalendarCheck2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
              {weeklyTasks.length} {weeklyTasks.length === 1 ? 'tarefa' : 'tarefas'} {weeklyTasks.length === 1 ? 'semanal' : 'semanais'}
            </span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Editar Cômodo
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label
                htmlFor="room-name-edit"
                className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
              >
                Nome do ambiente
              </label>
              <Input
                id="room-name-edit"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="rounded-xl border-slate-200/80 focus-visible:ring-teal-500 focus-visible:border-teal-500 dark:border-slate-800"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && !isSaving && handleSave()}
              />
            </div>
          </div>

          {/* Rodapé do Modal */}
          <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !editedName.trim()}
              className="rounded-xl h-9 text-xs font-semibold px-5 bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoomItem;
