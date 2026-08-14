import { apiClient } from "./client";
import type {
  ListRoomResponse,
  RoomResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomReorderRequest,
} from "@/context/room-types";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";

export const createRoomsApi = (householdId: string) => {
  const basePath = `/households/${householdId}/rooms`;

  return {
    listRooms: () => apiClient.get<ListRoomResponse>(basePath),

    createRoom: (data: CreateRoomRequest) =>
      apiClient.post<RoomResponse>(basePath, data),

    updateRoom: (id: string, data: UpdateRoomRequest) =>
      apiClient.patch<RoomResponse>(`${basePath}/${id}`, data),

    deleteRoom: (id: string) =>
      apiClient.delete<void>(`${basePath}/${id}`),

    reorderRooms: (data: RoomReorderRequest) =>
      apiClient.post<ListRoomResponse>(`${basePath}/reorder`, data),

    getActiveZone: () =>
      apiClient.get<ActiveZoneResponse>(`${basePath}/active-zone`),
  };
};

export type RoomsApi = ReturnType<typeof createRoomsApi>;