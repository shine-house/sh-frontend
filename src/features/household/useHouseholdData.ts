import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createRoomsApi } from "@/lib/api/rooms";
import { createZonesApi } from "@/lib/api/zones";
import { ApiError } from "@/lib/api/client";
import { householdKeys } from "@/lib/queryKeys/householdKeys";

export const useHouseholdData = () => {
  const { user, activeHouseholdId, isLoading: authLoading, logout } = useAuth();

  const roomsApi = activeHouseholdId ? createRoomsApi(activeHouseholdId) : null;
  const zonesApi = activeHouseholdId ? createZonesApi(activeHouseholdId) : null;

  const fetchRoomsAndZone = async () => {
    if (!roomsApi || !zonesApi) {
      return { rooms: [], activeZone: null };
    }
    try {
      const [roomsRes, zoneRes] = await Promise.all([
        roomsApi.listRooms(),
        zonesApi.getActiveZone().catch(() => null),
      ]);
      return { rooms: roomsRes.items, activeZone: zoneRes ?? null };
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await logout();
        return { rooms: [], activeZone: null };
      }
      throw error;
    }
  };

  const query = useQuery({
    // NOTE: rooms + activeZone stay combined — they're small, unpaginated, and consumed together everywhere.
    queryKey: activeHouseholdId ? [...householdKeys.rooms(activeHouseholdId), "with-zone"] : ["rooms", "disabled"],
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