
import React, { useState } from "react";
import { useTask, Task } from "@/contexts/TaskContext";
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
import { Plus } from "lucide-react";

interface TaskListProps {
  type: Task["type"];
  roomId?: string;
  title: string;
  readOnly?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ type, roomId, title, readOnly = false }) => {
  const { filterTasks, addTask, rooms } = useTask();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskRoomId, setNewTaskRoomId] = useState(roomId || "");
  
  const tasks = filterTasks(roomId, type);
  
  const handleAddTask = () => {
    if (!newTaskName.trim()) return;
    
    addTask({
      name: newTaskName,
      description: newTaskDescription || undefined,
      roomId: type !== "daily" ? newTaskRoomId : undefined,
      type
    });
    
    setNewTaskName("");
    setNewTaskDescription("");
    setIsAddingTask(false);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{title}</h2>
        {!readOnly && (
          <Button 
            size="sm"
            onClick={() => setIsAddingTask(true)}
            className="shine-gradient"
          >
            <Plus className="h-4 w-4 mr-1" /> Adicionar
          </Button>
        )}
      </div>
      
      {tasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Nenhuma tarefa adicionada</p>
          {!readOnly && (
            <Button 
              variant="link" 
              onClick={() => setIsAddingTask(true)}
              className="mt-2"
            >
              Adicionar tarefa
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
      
      <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Tarefa</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="task-name" className="text-sm font-medium">Nome</label>
              <Input
                id="task-name"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Nome da tarefa"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="task-description" className="text-sm font-medium">Descrição (opcional)</label>
              <Textarea
                id="task-description"
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Detalhes sobre a tarefa..."
              />
            </div>
            {type !== "daily" && !roomId && (
              <div className="space-y-2">
                <label htmlFor="task-room" className="text-sm font-medium">Cômodo</label>
                <Select value={newTaskRoomId} onValueChange={setNewTaskRoomId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cômodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancelar</Button>
            <Button onClick={handleAddTask} className="shine-gradient">Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
