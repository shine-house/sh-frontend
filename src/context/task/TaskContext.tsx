import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import * as roomsApi from "@/lib/api/rooms";
import * as tasksApi from "@/lib/api/tasks";
import type { RoomResponse } from "../room-types";
import type { TaskCreate, TaskUpdate, TaskWithStatus } from "../../lib/api/types/task-types";
import type { TaskTypeEnum } from "../../lib/api/types/util-types";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";
import type { TaskContextType } from "./types";
import { getStartOfWeek, addDays } from "./taskUtils";

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();

  const [rooms, setRooms] = useState<RoomResponse[]>([]);
  const [tasks, setTasks] = useState<TaskWithStatus[]>([]);
  const [activeZone, setActiveZone] = useState<ActiveZoneResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [roomsRes, tasksRes, zoneRes] = await Promise.all([
        roomsApi.listRooms(),
        tasksApi.listTasks(),
        roomsApi.getActiveZone().catch(() => null),
      ]);
      setRooms(roomsRes.items);
      setTasks(tasksRes.items);
      setActiveZone(zoneRes);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error("Erro ao carregar seus dados");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRooms([]);
      setTasks([]);
      setActiveZone(null);
      setIsLoading(false);
      return;
    }
    fetchAll();
  }, [user, authLoading, fetchAll]);

  const addRoom = async (name: string) => {
    try {
      const room = await roomsApi.createRoom({ name });
      setRooms((prev) => [...prev, room]);
    } catch (error) {
      console.error("Erro ao criar cômodo:", error);
      toast.error("Erro ao criar cômodo");
    }
  };

  const removeRoom = async (id: string) => {
    try {
      await roomsApi.deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
      setTasks((prev) => prev.filter((t) => t.room_id !== id));
    } catch (error) {
      console.error("Erro ao remover cômodo:", error);
      toast.error("Erro ao remover cômodo");
    }
  };

  const addTask = async (data: TaskCreate) => {
    try {
      const task = await tasksApi.createTask(data);
      setTasks((prev) => [...prev, task]);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao criar tarefa");
    }
  };

  const editTask = async (id: string, data: TaskUpdate) => {
    try {
      const updated = await tasksApi.updateTask(id, data);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (error) {
      console.error("Erro ao editar tarefa:", error);
      toast.error("Erro ao editar tarefa");
    }
  };

  const removeTask = async (id: string) => {
    try {
      await tasksApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Erro ao remover tarefa:", error);
      toast.error("Erro ao remover tarefa");
    }
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    try {
      if (task.is_available) {
        const execution = await tasksApi.completeTask(id);
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, is_available: false, last_execution: execution } : t
          )
        );
      } else if (task.last_execution) {
        await tasksApi.uncompleteTask(id, task.last_execution.id);
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, is_available: true, last_execution: null } : t))
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
      toast.error("Erro ao atualizar tarefa");
    }
  };

  const filterTasks = (roomId?: string, type?: TaskTypeEnum): TaskWithStatus[] => {
    return tasks
      .filter((t) => (roomId ? t.room_id === roomId : true) && (type ? t.type === type : true))
      .sort((a, b) => a.sort_order - b.sort_order);
  };

  // Client-side preview only — not an authorization/visibility decision.
  // The authoritative active zone is `activeZone`, fetched from the backend.
  const getZoneCalendar = (weeks: number) => {
    const calendar: Array<{ date: Date; roomId: string | null }> = [];
    if (!activeZone || rooms.length === 0) return calendar;

    const cycleLength = activeZone.cycle_length;
    let date = getStartOfWeek(new Date(activeZone.period_start_date));
    let position = activeZone.cycle_position;

    for (let i = 0; i < weeks; i++) {
      const room = rooms.find((r) => r.zone_cycle_position === position) ?? null;
      calendar.push({ date: new Date(date), roomId: room?.id ?? null });
      date = addDays(date, 7);
      position = (position % cycleLength) + 1;
    }

    return calendar;
  };

  return (
    <TaskContext.Provider
      value={{
        rooms,
        tasks,
        activeZone,
        isLoading,
        addRoom,
        removeRoom,
        addTask,
        toggleTaskStatus,
        editTask,
        removeTask,
        filterTasks,
        getZoneCalendar,
        refetch: fetchAll,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};