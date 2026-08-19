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
import { Edit, Trash, CalendarCheck2, HouseIcon } from "lucide-react";

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
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => onSelect(room.id)}
      >
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditedName(room.name);
                  setIsEditing(true);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span> <HouseIcon className="h-4 w-4" /> {zoneTasks.length} tarefas de zona</span>
            <span><CalendarCheck2 className="h-4 w-4" />{weeklyTasks.length} tarefas semanais</span>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cômodo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="room-name" className="text-sm font-medium">Nome</label>
              <Input
                id="room-name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
            <Button onClick={handleSave} className="shine-gradient" disabled={isSaving}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoomItem;