import { apiClient } from "./client";
import type {
  ListTaskWithStatusResponse,
  TaskCreate,
  TaskUpdate,
  TaskWithStatus,
  TaskQueryParams,
  TaskResponse,
} from "@/lib/api/types/task-types";

export const createTasksApi = (householdId: string) => {
  const basePath = `/households/${householdId}/tasks`;

  return {
    listTasks: (params?:TaskQueryParams) => {
      const query = new URLSearchParams();
      if (params?.roomId) query.set("room_id", params.roomId);
      if (params?.type) query.set("task_type", params.type);
      if (params?.page) query.set("page", params.page.toString());
      if (params?.size) query.set("size", params.size.toString());
      const qs = query.toString();
      return apiClient.get<ListTaskWithStatusResponse>(`${basePath}${qs ? `?${qs}` : ""}`);
    },

    createTask: (data: TaskCreate) =>
      apiClient.post<TaskResponse>(basePath, data),

    updateTask: (id: string, data: TaskUpdate) =>
      apiClient.put<TaskWithStatus>(`${basePath}/${id}`, data),

    deleteTask: (id: string) =>
      apiClient.delete<void>(`${basePath}/${id}`),

    completeTask: (taskId: string) =>
      apiClient.post<TaskWithStatus>(`${basePath}/${taskId}/execute`),

    uncompleteTask: (taskId: string) =>
       apiClient.delete<void>(`${basePath}/${taskId}/unmark`),
  };
};

export type TasksApi = ReturnType<typeof createTasksApi>;