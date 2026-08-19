import type { UserPublic } from "./user-types";
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

export interface ListTaskResponse {
  items: TaskResponse[];
  metadata: MetadataPagination;
}

export interface TaskQueryParams {
  roomId?: string;
  type?: TaskTypeEnum;
  page?: number;
  size?: number;
}

interface CompletionInfo {
user: UserPublic;
completed_at: string;
}

export interface TaskWithStatus extends TaskResponse {
  is_available: boolean;
  last_completion?: CompletionInfo;
}

export interface ListTaskWithStatusResponse {
  items: TaskWithStatus[];
  metadata: MetadataPagination;
}