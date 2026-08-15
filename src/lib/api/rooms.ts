import { apiClient } from "./client";
import type {
  ListRoomResponse,
  RoomResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomReorderRequest,
} from "@/lib/api/types/room-types";

export const createRoomsApi = (householdId: string) => {
  const basePath = `/households/${householdId}/rooms`;

  return {
    listRooms: () => apiClient.get<ListRoomResponse>(basePath),

    createRoom: (data: CreateRoomRequest) =>
      apiClient.post<RoomResponse>(basePath, data),

    getRoomById: (id: string) =>
      apiClient.patch<RoomResponse>(`${basePath}/${id}`),

    updateRoom: (id: string, data: UpdateRoomRequest) =>
      apiClient.put<RoomResponse>(`${basePath}/${id}`, data),

    deleteRoom: (id: string) =>
      apiClient.delete<void>(`${basePath}/${id}`),

    reorderRooms: (data: RoomReorderRequest) =>
      apiClient.post<ListRoomResponse>(`${basePath}/reorder`, data),

  };
};

export type RoomsApi = ReturnType<typeof createRoomsApi>;