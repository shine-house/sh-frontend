export interface RoomQueryFilters {
  page?: number;
  size?: number;
}

export const DEFAULT_ROOM_PAGE = 1;
export const DEFAULT_ROOM_SIZE = 10;

export const normalizeRoomFilters = (filters: RoomQueryFilters = {}) => ({
  page: filters.page ?? DEFAULT_ROOM_PAGE,
  size: filters.size ?? DEFAULT_ROOM_SIZE,
});

export const roomKeys = {
  all: (householdId: string) => ["rooms", householdId] as const,

  list: (householdId: string, filters: RoomQueryFilters = {}) =>
    ["rooms", householdId, "list", normalizeRoomFilters(filters)] as const,

  allWithZone: (householdId: string) => ["rooms", householdId, "with-zone"] as const,
};