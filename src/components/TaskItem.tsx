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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isDone = !task.is_available;

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleUpdateTask = () => {
    if (editedName.trim()) {
      updateTask(task.id, { name: editedName });
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(task.id);
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (isoDate: string) => {
    return format(new Date(isoDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
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
            <Button size="sm" onClick={handleUpdateTask}>Salvar</Button>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
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
            {isDone && task.last_execution && (
              <p className="text-xs text-muted-foreground mt-1">
                Concluída em: {formatDate(task.last_execution.executed_at)} por {task.name}
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
            <DropdownMenuItem onClick={() => setIsEditing(true)}>
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