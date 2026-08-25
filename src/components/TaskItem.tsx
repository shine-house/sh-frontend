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
import { MoreHorizontal, Pencil, Trash2, CheckCircle2 } from "lucide-react";
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
  const taskContext = { type: task.type, roomId: task.room_id };
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(task.name);
  const [editedDescription, setEditedDescription] = useState(task.description ?? "");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const formatDate = (isoDate: string) => {
    return format(new Date(isoDate), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const isDone = !task.is_available;
  const isPending = task.isPending === true;
  const completedByName = task.last_completion?.user.name.split(' ')[0] || task.last_completion?.user.email.split("@")[0] || "-";
  const completedDate = formatDate(
    task.last_completion?.completed_at ?? new Date().toISOString()
  );

const handleToggleStatus = () => {
  toggleTaskStatus(task.id, task.is_available, taskContext);
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
      updateTask(task.id, { name: editedName.trim(), description: editedDescription.trim() || null }, taskContext);
      setIsEditing(false);
    }
  };

  const handleDeleteTask = () => {
    deleteTask(task.id, taskContext);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3.5 p-3.5 border rounded-xl bg-white dark:bg-slate-900 transition-all duration-200 group",
        isDone
          ? "border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-900/40 opacity-75"
          : "border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm"
      )}
    >
      <div className="flex items-center h-5 mt-0.5">
        <Checkbox
          checked={isDone}
          onCheckedChange={handleToggleStatus}
          disabled={isPending}
          className="h-4 w-4 rounded-md border-slate-300 dark:border-slate-700 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 dark:data-[state=checked]:bg-teal-500 dark:data-[state=checked]:border-teal-500 transition-colors"
        />
      </div>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3 pr-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="flex-1 rounded-xl h-9 text-sm focus-visible:ring-teal-500 border-slate-200 dark:border-slate-800"
                autoFocus
                placeholder="Nome da tarefa"
                onKeyDown={(e) => e.key === "Enter" && handleUpdateTask()}
              />
              <Input
                value={editedDescription}
                placeholder="Notas ou observações (opcional)"
                onChange={(e) => setEditedDescription(e.target.value)}
                className="flex-1 sm:max-w-xs rounded-xl h-9 text-sm focus-visible:ring-teal-500 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                onKeyDown={(e) => e.key === "Enter" && handleUpdateTask()}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                size="sm"
                onClick={handleUpdateTask}
                className="rounded-lg h-8 text-xs font-medium px-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-200"
              >
                Salvar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelEdit}
                className="rounded-lg h-8 text-xs font-medium px-3 border-slate-200 dark:border-slate-800"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <span
              className={cn(
                "block text-sm font-medium leading-tight text-slate-800 dark:text-slate-200 transition-all",
                isDone && "line-through text-slate-400 dark:text-slate-500 font-normal"
              )}
            >
              {task.name}
            </span>
            {isPending && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-ping" />
                Salvando...
              </span>
            )}

            {task.description && (
              <p className={cn(
                "text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-xl",
                isDone && "text-slate-400/80 dark:text-slate-500/80"
              )}>
                {task.description}
              </p>
            )}

            {isDone && task.last_completion && (
              <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-400 dark:text-slate-500">
                <CheckCircle2 className="h-3 w-3 text-teal-500 dark:text-teal-600 shrink-0" />
                <span>
                  Concluída em {completedDate} por <span className="font-semibold text-slate-500 dark:text-slate-400">{completedByName}</span>
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {!readOnly && !isEditing && !isPending && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150 shrink-0 data-[state=open]:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl min-w-[120px] p-1 border-slate-200 dark:border-slate-800">
            <DropdownMenuItem
              onClick={handleStartEditing}
              className="rounded-lg text-xs gap-2 py-2 cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <Pencil className="h-3.5 w-3.5 text-slate-400" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="rounded-lg text-xs gap-2 py-2 cursor-pointer text-rose-600 focus:text-rose-600 focus:bg-rose-50 dark:focus:bg-rose-950/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* Alerta de Confirmação para Deleção */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-[400px] p-6 border-slate-200 dark:border-slate-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 dark:text-slate-50">
              Excluir tarefa
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400">
              Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTask}
              className="rounded-xl h-9 text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white dark:bg-rose-600 dark:hover:bg-rose-700 border-none"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TaskItem;
