import React, { useState } from "react";
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
import { Plus, Inbox, AlertCircle } from "lucide-react";
import type { TaskTypeEnum } from "@/lib/api/types/util-types";
import type { LucideIcon } from "lucide-react";

interface TaskListProps {
  type: TaskTypeEnum;
  icon?: LucideIcon;
  roomId?: string;
  title: string;
  readOnly?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ type, icon: Icon, roomId, title, readOnly = false }) => {

  const { filterTasks, addTask, rooms } = useTask();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskRoomId, setNewTaskRoomId] = useState(roomId ?? "");
  const [roomError, setRoomError] = useState<string | null>(null);

  const tasks = filterTasks(roomId, type);

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    if (!newTaskRoomId) {
      setRoomError("Selecione um cômodo para a tarefa");
      return;
    }

    addTask({
      name: newTaskName,
      description: newTaskDescription || undefined,
      type,
      room_id: newTaskRoomId,
    });

    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskRoomId(roomId ?? "");
    setRoomError(null);
    setIsAddingTask(false);
  };

  const handleCancel = () => {
    setNewTaskName("");
    setNewTaskDescription("");
    setNewTaskRoomId(roomId ?? "");
    setRoomError(null);
    setIsAddingTask(false);
  };

  return (
    <div className="space-y-4">
      {/* Cabeçalho da Lista */}
      <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-800 dark:text-slate-200">
          {Icon && <Icon size={20} />}
          <span>{title}</span>
        </h2>
        {!readOnly && (
          <Button
            size="sm"
            onClick={() => setIsAddingTask(true)}
            className="shine-gradient rounded-xl px-3 h-8 text-xs font-medium font-sans shadow-sm transition-transform active:scale-95"
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar
          </Button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="py-10 text-center flex flex-col items-center justify-center bg-slate-50/40 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-full shadow-sm text-slate-400 dark:text-slate-600 mb-2.5">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Tudo limpo por aqui!</p>
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
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} readOnly={readOnly} />
          ))}
        </div>
      )}

      <Dialog open={isAddingTask} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl p-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Nova Tarefa
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">
            {/* Campo Nome */}
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

            {/* Campo Descrição */}
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
                  <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
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
                  <div className="flex items-center gap-1.5 text-xs font-medium text-rose-500 mt-1 animate-in fade-in slide-in-from-top-1">
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
              Salvar Tarefa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
