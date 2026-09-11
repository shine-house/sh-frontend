import type { MetadataPagination, UUID } from "./util-types";

export interface ListRoomResponse {
  items: RoomResponse[];
  metadata: MetadataPagination;
}

export interface CreateRoomRequest {
  name: string;
}

export interface UpdateRoomRequest {
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
  created_at: string;
  updated_at: string;
}

export interface RoomReorderRequest {
  room_ids: UUID[];
}

export interface RoomQueryParams {
  page?: number;
  size?: number;
}