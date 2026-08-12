export type UUID = string;

export interface RoomCreate {
  name: string;
}

export interface RoomUpdate {
  name?: string | null;
  position?: number | null;
  zone_cycle_position?: number | null;
}

export interface RoomResponse {
  id: UUID;
  household_id: UUID;
  name: string;
  position: number;
  zone_cycle_position: number;
  created_at: string; // ISO datetime
  updated_at: string; // ISO datetime
}

export interface RoomReorderRequest {
  room_ids: UUID[];
}

export type TaskTypeEnum = "daily" | "weekly" | "zone";

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

export type TaskContextType = {
  rooms: RoomResponse[];
  tasks: TaskResponse[];
  currentZoneIndex: number;
  currentZone: RoomResponse | null;
  zoneStartDate: Date;
  nextZoneChangeDate: Date;
  addRoom: (name: string) => void;
  removeRoom: (id: string) => void;
  addTask: (task: TaskCreate) => void;
  toggleTaskStatus: (id: string) => void;
  editTask: (id: string, data: TaskUpdate) => void;
  removeTask: (id: string) => void;
  reorderTask: (id: string, newOrder: number) => void;
  filterTasks: (roomId?: string, type?: TaskResponse["type"]) => TaskResponse[];
  sharingKey: string | null;
  isSharingEnabled: boolean;
  enableSharing: () => Promise<void>;
  disableSharing: () => void;
  loadSharedTasks: (key: string) => Promise<boolean>;
  getZoneCalendar: (weeks: number) => Array<{ date: Date; zone: RoomResponse | null }>;
  manuallySetCurrentZone: (zoneId: string) => void;
  // connectedUsers: ConnectedUser[];
  removeConnectedUser: (userId: string) => void;
};
