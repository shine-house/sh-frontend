import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createRoomsApi, type RoomsApi } from "@/lib/api/rooms";
import { createZonesApi } from "@/lib/api/zones";
import { ApiError } from "@/lib/api/client";
import { householdKeys } from "@/lib/queryKeys/householdKeys";
import { roomKeys } from "@/lib/queryKeys/roomKeys";

export const useHouseholdData = () => {
  const { user, activeHouseholdId, isLoading: authLoading, logout } = useAuth();

  const roomsApi = activeHouseholdId ? createRoomsApi(activeHouseholdId) : null;
  const zonesApi = activeHouseholdId ? createZonesApi(activeHouseholdId) : null;


  const fetchAllRooms = async (roomsApi: RoomsApi) => {
  const first = await roomsApi.listRooms({ page: 1, size: 100 });
  if (!first.metadata.has_next) return first.items;

  const pages = await Promise.all(
    Array.from({ length: first.metadata.total_pages - 1 }, (_, i) =>
      roomsApi.listRooms({ page: i + 2, size: 100 })
    )
  );
  return [first.items, ...pages.map((p) => p.items)].flat();
}

  const fetchRoomsAndZone = async () => {
    if (!roomsApi || !zonesApi) {
      return { rooms: [], activeZone: null };
    }
    try {
      const [rooms, zoneRes] = await Promise.all([
        fetchAllRooms(roomsApi),
        zonesApi.getActiveZone().catch(() => null),
      ]);
      return { rooms, activeZone: zoneRes ?? null };

    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await logout();
        return { rooms: [], activeZone: null };
      }
      throw error;
    }
  };

  const query = useQuery({
    queryKey: activeHouseholdId ? [...roomKeys.allWithZone(activeHouseholdId)] : ["rooms", "disabled"],
    queryFn: fetchRoomsAndZone,
    enabled: !!user && !!activeHouseholdId && !authLoading,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    rooms: query.data?.rooms ?? [],
    activeZone: query.data?.activeZone ?? null,
    isLoading: authLoading || query.isLoading,
    refetch: query.refetch,
  };
};