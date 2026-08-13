import type { MetadataPagination, TaskTypeEnum } from "./util-types";

export interface TaskCreate {
  name: string;
  description?: string | null;
  type: TaskTypeEnum;
  room_id: string;
}

export interface TaskUpdate {
  name?: string | null;
  description?: string | null;
  type?: TaskTypeEnum | null;
  room_id?: string | null;
}

export interface TaskResponse {
  id: string;
  household_id: string;
  room_id: string;
  name: string;
  description: string | null;
  type: TaskTypeEnum;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface TaskExecutionCreate {
  notes?: string | null;
}

export interface TaskExecutionUpdate {
  notes?: string | null;
}

export interface TaskExecutionResponse {
  id: string;
  task_id: string;
  user_id: string;
  execution_date: string; // YYYY-MM-DD
  executed_at: string; // ISO datetime
  notes: string | null;
}

export interface ListTaskResponse {
  items: TaskResponse[];
  metadata: MetadataPagination;
}

// TODO: create new endpoints to return these infos
//  refactor the create and update tasks to return this
export interface TaskWithStatus extends TaskResponse {
  is_available: boolean;
  last_execution: TaskExecutionResponse | null;
}

export interface ListTaskWithStatusResponse {
  items: TaskWithStatus[];
  metadata: MetadataPagination;
}