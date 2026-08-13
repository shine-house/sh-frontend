import type { ListRoomResponse } from "../room-types";
import type { ListTaskResponse, TaskCreate, TaskUpdate } from "../task-types";
import type { TaskTypeEnum } from "../util-types";

export type TaskContextType = {
  rooms: ListRoomResponse[];
  tasks: ListTaskResponse[];
  currentZoneIndex: number;
  currentZone: number | null;
  zoneStartDate: Date;
  nextZoneChangeDate: Date;
  addRoom: (name: string) => void;
  removeRoom: (id: string) => void;
  addTask: (task: TaskCreate) => void;
  toggleTaskStatus: (id: string) => void;
  editTask: (id: string, data: TaskUpdate) => void;
  removeTask: (id: string) => void;
  reorderTask: (id: string, newOrder: number) => void;
  filterTasks: (roomId?: string, type?: TaskTypeEnum) => ListTaskResponse[];
  sharingKey: string | null;
  isSharingEnabled: boolean;
  enableSharing: () => Promise<void>;
  disableSharing: () => void;
  loadSharedTasks: (key: string) => Promise<boolean>;
  getZoneCalendar: (weeks: number) => Array<{ date: Date; zone: number | null }>;
  manuallySetCurrentZone: (zoneId: string) => void;
  // connectedUsers: ConnectedUser[];
  removeConnectedUser: (userId: string) => void;
};
