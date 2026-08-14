import { apiClient } from "./client";
import type {
  ListRoomResponse,
  RoomResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomReorderRequest,
} from "@/context/room-types";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";

export const listRooms = () => apiClient.get<ListRoomResponse>("/rooms");

export const createRoom = (data: CreateRoomRequest) =>
  apiClient.post<RoomResponse>("/rooms", data);

export const updateRoom = (id: string, data: UpdateRoomRequest) =>
  apiClient.patch<RoomResponse>(`/rooms/${id}`, data);

export const deleteRoom = (id: string) => apiClient.delete<void>(`/rooms/${id}`);

export const reorderRooms = (data: RoomReorderRequest) =>
  apiClient.post<ListRoomResponse>("/rooms/reorder", data);

export const getActiveZone = () =>
  apiClient.get<ActiveZoneResponse>("/rooms/active-zone");