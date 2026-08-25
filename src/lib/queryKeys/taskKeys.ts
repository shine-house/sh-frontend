import type { TaskTypeEnum } from "@/lib/api/types/util-types";

export interface TaskQueryFilters {
  roomId?: string;
  type?: TaskTypeEnum;
  page?: number;
  size?: number;
}

export const DEFAULT_PAGE = 1;
export const DEFAULT_SIZE = 10;

export const normalizeTaskFilters = (filters: TaskQueryFilters = {}): Required<Omit<TaskQueryFilters, "roomId" | "type">> & Pick<TaskQueryFilters, "roomId" | "type"> => ({
  roomId: filters.roomId,
  type: filters.type,
  page: filters.page ?? DEFAULT_PAGE,
  size: filters.size ?? DEFAULT_SIZE,
});

export const taskKeys = {
  all: (householdId: string) => ["tasks", householdId] as const,

  list: (householdId: string, filters: TaskQueryFilters = {}) =>
    ["tasks", householdId, normalizeTaskFilters(filters)] as const,
};