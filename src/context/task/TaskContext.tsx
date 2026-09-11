import React, { createContext, useContext } from "react";
import { useAuth } from "@/context/AuthContext";
import { useHouseholdData } from "@/features/household/useHouseholdData";
import { useTaskMutations } from "@/features/tasks/useTaskMutations";

import type { UpdateRoomRequest } from "@/lib/api/types/room-types";
import type { TaskCreate, TaskUpdate } from "../../lib/api/types/task-types";
import type { TaskTypeEnum } from "../../lib/api/types/util-types";
import type { TaskContextType } from "./types";

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

  const { rooms, activeZone, isLoading: householdLoading, refetch } = useHouseholdData();
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

  const editTask = async (id: string, data: TaskUpdate, context: { type: TaskTypeEnum; roomId: string }) => {
    await editTaskMutation(id, data, context);
  };

  const removeTask = async (id: string, context: { type: TaskTypeEnum; roomId: string }) => {
    await removeTaskMutation(id, context);
  };


  const toggleTaskStatus = async (
    id: string,
    isAvailable: boolean,
    context: { type: TaskTypeEnum; roomId: string }
  ) => {
    await toggleTaskStatusMutation(id, isAvailable, context);
  };

  return (
    <TaskContext.Provider
      value={{
        rooms,
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
        refetch: refetchSafe,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};