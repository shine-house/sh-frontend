import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createRoomsApi } from "@/lib/api/rooms";
import { roomKeys, DEFAULT_ROOM_PAGE, DEFAULT_ROOM_SIZE, type RoomQueryFilters } from "@/lib/queryKeys/roomKeys";

export interface UseRoomsQueryOptions extends RoomQueryFilters {
  enabled?: boolean;
}

export const useRoomsQuery = ({
  page = DEFAULT_ROOM_PAGE,
  size = DEFAULT_ROOM_SIZE,
  enabled = true,
}: UseRoomsQueryOptions) => {
  const { activeHouseholdId } = useAuth();
  const roomsApi = activeHouseholdId ? createRoomsApi(activeHouseholdId) : null;

  const query = useQuery({
    queryKey: roomKeys.list(activeHouseholdId ?? "no-household", { page, size }),
    queryFn: async () => {
      if (!roomsApi) throw new Error("Household not ready");
      return roomsApi.listRooms({ page, size });
    },
    enabled: !!activeHouseholdId && enabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    rooms: query.data?.items ?? [],
    metadata: query.data?.metadata,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};