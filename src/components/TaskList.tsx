import React, { useState, useEffect } from "react";
import { useTask } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Plus, Inbox, AlertCircle, Loader2 } from "lucide-react";
import type { TaskTypeEnum } from "@/lib/api/types/util-types";
import type { LucideIcon } from "lucide-react";
import { useTasksQuery } from "@/features/tasks/useTasksQuery";
import { DEFAULT_PAGE, DEFAULT_SIZE } from "@/lib/queryKeys/taskKeys";
import { cn } from "@/lib/utils";

interface TaskListProps {
  type: TaskTypeEnum;
  icon?: LucideIcon;
  roomId?: string;
  title: string;
  readOnly?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ type, icon: Icon, roomId, title, readOnly = false }) => {
  const { addTask, rooms } = useTask();
  const [page, setPage] = useState(DEFAULT_PAGE);

  // Capturando também o isLoading para a primeira busca da query
  const { tasks, metadata, isFetching, isLoading } = useTasksQuery({ roomId, type, page, size: DEFAULT_SIZE });

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskRoomId, setNewTaskRoomId] = useState(roomId ?? "");
  const [roomError, setRoomError] = useState<string | null>(null);

  useEffect(() => {
    const nextRoomId = roomId ?? "";
    setNewTaskRoomId(nextRoomId);
    setRoomError(null);
  }, [roomId]);

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const targetRoomId = roomId ?? newTaskRoomId;

    if (!targetRoomId) {
      setRoomError("Selecione um cômodo para a tarefa");
      return;
    }

    void addTask({
      name: newTaskName,
      description: newTaskDescription || undefined,
      type,
      room_id: targetRoomId,
    });

    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskRoomId(targetRoomId);
    setRoomError(null);
    setIsAddingTask(false);
  };

  const handleCancel = () => {
    const nextRoomId = roomId ?? "";
    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskRoomId(nextRoomId);
    setRoomError(null);
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-4">
      {/* Paginação */}
      {metadata && metadata.total_pages > 1 && (
        <div className="flex justify-between items-center pt-2">
          <Button size="sm" variant="outline" disabled={!metadata.has_previous || isFetching}
            className="rounded-xl h-8 text-xs font-semibold px-3"
            onClick={() => setPage((p) => p - 1)}>
            Anterior
          </Button>
          <span className="text-xs text-slate-400 font-medium">Página {metadata.page} de {metadata.total_pages}</span>
          <Button size="sm" variant="outline" disabled={!metadata.has_next || isFetching}
            className="rounded-xl h-8 text-xs font-semibold px-3"
            onClick={() => setPage((p) => p + 1)}>
            Próxima
          </Button>
        </div>
      )}

      {/* Cabeçalho da Lista */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-800 dark:text-slate-200">
          {Icon && <Icon size={20} className="text-slate-500 dark:text-slate-400" />}
          <span>{title}</span>
        </h2>
        {!readOnly && (
          <Button
            size="sm"
            onClick={() => setIsAddingTask(true)}
            disabled={isLoading}
            className="shine-gradient rounded-xl px-3 h-8 text-xs font-medium font-sans shadow-sm transition-transform active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
          </Button>
        )}
      </div>

      {/* Gerenciamento de Estados de Loading Local / Skeletons */}
      {isLoading && tasks.length === 0 ? (
        // Estado 1: Carregamento Inicial (Skeletons)
        <div className="space-y-2 animate-in fade-in duration-300">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-12 border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3 w-2/3">
                <div className="h-4 w-4 bg-slate-200/80 dark:bg-slate-800 rounded-md animate-pulse shrink-0" />
                <div className="h-3.5 bg-slate-200/80 dark:bg-slate-800 rounded-md w-full animate-pulse" />
              </div>
              <div className="h-3.5 bg-slate-100 dark:bg-slate-800 rounded-md w-16 animate-pulse" />
            </div>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        // Estado 2: Lista Vazia Concluída
        <div className="py-10 text-center flex flex-col items-center justify-center bg-slate-50/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl animate-in fade-in duration-300">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 dark:text-slate-600 mb-2.5">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Tudo limpo por aqui!</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Nenhuma tarefa pendente nesta categoria.</p>
          {!readOnly && (
            <Button
              variant="link"
              onClick={() => setIsAddingTask(true)}
              className="mt-2 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 p-0 h-auto"
            >
              Criar primeira tarefa
            </Button>
          )}
        </div>
      ) : (
        // Estado 3: Lista Ativa com Esmaecimento Suave em Background Fetch
        <div className="relative overflow-hidden rounded-xl">
          <div className={cn("space-y-2 transition-opacity duration-300", isFetching && "opacity-60 pointer-events-none")}>
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} readOnly={readOnly} />
            ))}
          </div>

          {/* Spinner flutuante sutil se houver paginação ou atualização paralela */}
          {isFetching && (
            <div className="absolute top-2 right-2 bg-white/80 dark:bg-slate-900/80 p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm backdrop-blur-sm animate-in fade-in duration-200">
              <Loader2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 animate-spin" />
            </div>
          )}
        </div>
      )}

      {/* Modal / Dialog para Criar Nova Tarefa */}
      <Dialog open={isAddingTask} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Nova Tarefa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="space-y-1.5">
              <label htmlFor="task-name" className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Nome da tarefa
              </label>
              <Input
                id="task-name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Ex: Organizar gaveta de talheres"
                className="rounded-xl border-slate-200/80 focus-visible:ring-teal-500 focus-visible:border-teal-500 dark:border-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="task-description" className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Descrição <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <Textarea
                id="task-description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Adicione detalhes úteis..."
                className="rounded-xl min-h-[90px] resize-none border-slate-200/80 focus-visible:ring-teal-500 dark:border-slate-800"
              />
            </div>

            {!roomId && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Cômodo / Ambiente
                </label>
                <Select
                  value={newTaskRoomId}
                  onValueChange={(value) => {
                    setNewTaskRoomId(value);
                    setRoomError(null);
                  }}
                >
                  <SelectTrigger className="rounded-xl border-slate-200/80 dark:border-slate-800 focus:ring-teal-500 text-left">
                    <SelectValue placeholder="Selecione onde realizar a tarefa" />
                  </SelectTrigger>
                                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
                    {rooms?.map((room) => (
                      <SelectItem
                        key={room.id}
                        value={room.id}
                        className="rounded-lg text-sm cursor-pointer focus:bg-slate-50 dark:focus:bg-slate-800"
                      >
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {roomError && (
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 animate-in fade-in duration-200">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{roomError}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-xl border-slate-200 dark:border-slate-800 h-9 text-xs font-semibold px-4"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleAddTask}
              disabled={!newTaskName.trim()}
              className="rounded-xl h-9 text-xs font-semibold px-5 bg-teal-600 hover:bg-teal-500 text-white dark:bg-teal-600 dark:hover:bg-teal-700 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
