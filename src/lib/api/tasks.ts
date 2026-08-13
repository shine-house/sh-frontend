import { apiClient } from "./client";
import type {
  ListTaskWithStatusResponse,
  TaskCreate,
  TaskUpdate,
  TaskWithStatus,
  TaskExecutionResponse,
} from "@/lib/api/types/task-types";
import type { TaskTypeEnum } from "@/lib/api/types/util-types";

export const listTasks = (params?: { roomId?: string; type?: TaskTypeEnum }) => {
  const query = new URLSearchParams();
  if (params?.roomId) query.set("room_id", params.roomId);
  if (params?.type) query.set("type", params.type);
  const qs = query.toString();
  return apiClient.get<ListTaskWithStatusResponse>(`/tasks${qs ? `?${qs}` : ""}`);
};

export const createTask = (data: TaskCreate) =>
  apiClient.post<TaskWithStatus>("/tasks", data);

export const updateTask = (id: string, data: TaskUpdate) =>
  apiClient.patch<TaskWithStatus>(`/tasks/${id}`, data);

export const deleteTask = (id: string) => apiClient.delete<void>(`/tasks/${id}`);

export const completeTask = (id: string) =>
  apiClient.post<TaskExecutionResponse>(`/tasks/${id}/executions`, {});

export const uncompleteTask = (id: string, executionId: string) =>
  apiClient.delete<void>(`/tasks/${id}/executions/${executionId}`);