import { apiClient } from "./client";
import type {
  ListRoomResponse,
  RoomResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  RoomReorderRequest,
  RoomQueryParams,
} from "@/lib/api/types/room-types";

export const createRoomsApi = (householdId: string) => {
  const basePath = `/households/${householdId}/rooms`;

  return {
    listRooms: (params?: RoomQueryParams) => {
      const query = new URLSearchParams();
      if (params?.page) query.set("page", params.page.toString());
      if (params?.size) query.set("size", params.size.toString());
      const qs = query.toString();
      return apiClient.get<ListRoomResponse>(`${basePath}${qs ? `?${qs}` : ""}`);
    },

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