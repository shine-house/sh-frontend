import type { RoomResponse } from "../room-types";
import type { TaskWithStatus, TaskCreate, TaskUpdate } from "../../lib/api/types/task-types";
import type { TaskTypeEnum } from "../../lib/api/types/util-types";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";

export type TaskContextType = {
  rooms: RoomResponse[];
  tasks: TaskWithStatus[];
  activeZone: ActiveZoneResponse | null;
  isLoading: boolean;
  addRoom: (name: string) => Promise<void>;
  removeRoom: (id: string) => Promise<void>;
  addTask: (task: TaskCreate) => Promise<void>;
  toggleTaskStatus: (id: string) => Promise<void>;
  editTask: (id: string, data: TaskUpdate) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  filterTasks: (roomId?: string, type?: TaskTypeEnum) => TaskWithStatus[];
  getZoneCalendar: (weeks: number) => Array<{ date: Date; roomId: string | null }>;
  refetch: () => Promise<void>;
};