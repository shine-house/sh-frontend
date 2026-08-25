import type { RoomResponse, UpdateRoomRequest } from "@/lib/api/types/room-types";
import type { TaskCreate, TaskUpdate } from "../../lib/api/types/task-types";
import type { TaskTypeEnum } from "../../lib/api/types/util-types";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";

export type TaskMutationContext = { type: TaskTypeEnum; roomId: string };

export type TaskContextType = {
  rooms: RoomResponse[];
  activeZone: ActiveZoneResponse | null;
  isLoading: boolean;
  addRoom: (name: string) => Promise<void>;
  editRoom: (id: string, data: UpdateRoomRequest) => Promise<void>;
  removeRoom: (id: string) => Promise<void>;
  reorderRooms: (roomIds: string[]) => Promise<void>;
  addTask: (task: TaskCreate) => Promise<void>;
  toggleTaskStatus: (id: string, isAvailable: boolean, context: TaskMutationContext) => Promise<void>;
  editTask: (id: string, data: TaskUpdate, context: TaskMutationContext) => Promise<void>;
  removeTask: (id: string, context: TaskMutationContext) => Promise<void>;
  refetch: () => Promise<void>;
};