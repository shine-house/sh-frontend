import type { TaskCreate, TaskWithStatus } from "@/lib/api/types/task-types";

const OPTIMISTIC_ID_PREFIX = "optimistic-";

export const generateOptimisticId = () =>
  `${OPTIMISTIC_ID_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const isOptimisticTask = (task: TaskWithStatus) => task.id.startsWith(OPTIMISTIC_ID_PREFIX);

export const createOptimisticTask = (data: TaskCreate, householdId: string): TaskWithStatus => {
  const now = new Date().toISOString();
  return {
    id: generateOptimisticId(),
    household_id: householdId,
    room_id: data.room_id,
    name: data.name,
    description: data.description ?? null,
    type: data.type,
    sort_order: 0,
    created_at: now,
    updated_at: now,
    is_available: true,
    last_completion: undefined,
    isPending: true,
  };
};