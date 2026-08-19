import React, { createContext, useContext, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHouseholdData } from "@/features/household/useHouseholdData";
import { useTaskMutations } from "@/hooks/useTaskMutations";

import type { UpdateRoomRequest } from "@/lib/api/types/room-types";
import type { TaskCreate, TaskUpdate, TaskWithStatus } from "../../lib/api/types/task-types";
import type { TaskTypeEnum } from "../../lib/api/types/util-types";
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
  const { activeHouseholdId: _activeHouseholdId } = useAuth();
  const {
    addRoom: addRoomMutation,
    reorderRooms: reorderRoomsMutation,
    editRoom: editRoomMutation,
    removeRoom: removeRoomMutation,
    addTask: addTaskMutation,
    editTask: editTaskMutation,
    removeTask: removeTaskMutation,
    toggleTaskStatus: toggleTaskStatusMutation,
    isLoading: mutationsLoading,
  } = useTaskMutations();

  const { rooms, tasks, activeZone, isLoading: householdLoading, refetch } = useHouseholdData();
  const isLoading = householdLoading || mutationsLoading;

  const refetchSafe = async () => {
    await refetch();
  };

  const addRoom = async (name: string) => {
    await addRoomMutation(name);
  };

  const reorderRooms = async (roomIds: string[]) => {
    await reorderRoomsMutation(roomIds);
  };

  const editRoom = async (id: string, data: UpdateRoomRequest) => {
    await editRoomMutation(id, data);
  };

  const removeRoom = async (id: string) => {
    await removeRoomMutation(id);
  };

  const addTask = async (data: TaskCreate) => {
    await addTaskMutation(data);
  };

  const editTask = async (id: string, data: TaskUpdate) => {
    await editTaskMutation(id, data);
  };

  const removeTask = async (id: string) => {
    await removeTaskMutation(id);
  };

  const toggleTaskStatus = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    await toggleTaskStatusMutation(id, task.is_available, task.last_completion?.completed_at ?? null);
  };

  const filterTasks = useCallback(
    (roomId?: string, type?: TaskTypeEnum): TaskWithStatus[] => {
      return tasks
        .filter((t) => (roomId ? t.room_id === roomId : true) && (type ? t.type === type : true))
        .sort((a, b) => a.sort_order - b.sort_order);
    },
    [tasks]
  );

  const getZoneCalendar = useCallback(
    (weeks: number) => {
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
    },
    [activeZone, rooms]
  );

  return (
    <TaskContext.Provider
      value={{
        rooms,
        tasks,
        activeZone,
        isLoading,
        reorderRooms,
        addRoom,
        editRoom,
        removeRoom,
        addTask,
        toggleTaskStatus,
        editTask,
        removeTask,
        filterTasks,
        getZoneCalendar,
        refetch: refetchSafe,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};