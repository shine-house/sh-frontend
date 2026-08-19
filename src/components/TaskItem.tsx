import React, { useState } from "react";
import { useTask } from "@/context/TaskContext";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { TaskWithStatus } from "@/lib/api/types/task-types";

interface TaskItemProps {
  task: TaskWithStatus;
  readOnly?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, readOnly = false }) => {
  const { toggleTaskStatus, editTask: updateTask, removeTask: deleteTask } = useTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description ?? "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const formatDate = (isoDate: string) => {
    return format(new Date(isoDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const isDone = !task.is_available;
  const completedByName = task.last_completion?.user.name.split(' ')[0] || task.last_completion?.user.email.split("@")[0] || "-";
  const completedDate = formatDate(
    task.last_completion?.completed_at ?? new Date().toISOString()
  );

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

   const handleStartEditing = () => {
    setEditedName(task.name);
    setEditedDescription(task.description ?? "");
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedName(task.name);
    setEditedDescription(task.description ?? "");
    setIsEditing(false);
  };

  const handleUpdateTask = () => {
    if (editedName.trim()) {
      updateTask(task.id, {
        name: editedName.trim(),
        description: editedDescription.trim() || null,
      });
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
  };


  return (
    <div className="flex items-start gap-3 p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      <Checkbox
        checked={isDone}
        onCheckedChange={handleToggleStatus}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleUpdateTask()}
            />
            <Input
              value={editedDescription}
              placeholder="notas (opcional)"
              onChange={(e) => setEditedDescription(e.target.value)}
              className="text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUpdateTask}>Salvar</Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>Cancelar</Button>
            </div>
          </div>
        ) : (
          <>
            <span
              className={cn(
                "block text-sm leading-5",
                isDone && "line-through text-muted-foreground"
              )}
            >
              {task.name}
            </span>
            {task.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {task.description}
              </p>
            )}
            {isDone && task.last_completion && (
              <p className="text-xs text-muted-foreground mt-1">
                Concluída em: {completedDate} por {completedByName}
              </p>
            )}
          </>
        )}
      </div>

      {!readOnly && !isEditing && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleStartEditing}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir tarefa</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskItem;