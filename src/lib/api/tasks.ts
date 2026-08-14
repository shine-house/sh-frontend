import { apiClient } from "./client";
import type {
  ListTaskWithStatusResponse,
  TaskCreate,
  TaskUpdate,
  TaskWithStatus,
  TaskExecutionResponse,
} from "@/lib/api/types/task-types";
import type { TaskTypeEnum } from "@/lib/api/types/util-types";

export const createTasksApi = (householdId: string) => {
  const basePath = `/households/${householdId}/tasks`;

  return {
    listTasks: (params?: { roomId?: string; type?: TaskTypeEnum }) => {
      const query = new URLSearchParams();
      if (params?.roomId) query.set("room_id", params.roomId);
      if (params?.type) query.set("type", params.type);
      const qs = query.toString();
      return apiClient.get<ListTaskWithStatusResponse>(`${basePath}${qs ? `?${qs}` : ""}`);
    },

    createTask: (data: TaskCreate) =>
      apiClient.post<TaskWithStatus>(basePath, data),

    updateTask: (id: string, data: TaskUpdate) =>
      apiClient.patch<TaskWithStatus>(`${basePath}/${id}`, data),

    deleteTask: (id: string) =>
      apiClient.delete<void>(`${basePath}/${id}`),

    completeTask: (id: string) =>
      apiClient.post<TaskExecutionResponse>(`${basePath}/${id}/executions`, {}),

    uncompleteTask: (id: string, executionId: string) =>
      apiClient.delete<void>(`${basePath}/${id}/executions/${executionId}`),
  };
};

export type TasksApi = ReturnType<typeof createTasksApi>;