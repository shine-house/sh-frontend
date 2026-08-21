import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createTasksApi } from "@/lib/api/tasks";
import { createRoomsApi } from "@/lib/api/rooms";
import { createZonesApi } from "@/lib/api/zones";
import { ApiError } from "@/lib/api/client";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";

export const useHouseholdData = () => {
  const { user, activeHouseholdId, isLoading: authLoading, logout } = useAuth();

  const tasksApi = activeHouseholdId ? createTasksApi(activeHouseholdId) : null;
  const roomsApi = activeHouseholdId ? createRoomsApi(activeHouseholdId) : null;
  const zonesApi = activeHouseholdId ? createZonesApi(activeHouseholdId) : null;

  const fetchAll = async () => {
    if (!roomsApi || !tasksApi || !zonesApi) {
      return { rooms: [], tasks: [], activeZone: null as ActiveZoneResponse | null };
    }

    try {
      const [roomsRes, tasksRes, zoneRes] = await Promise.all([
        roomsApi.listRooms(),
        tasksApi.listTasks(),
        zonesApi.getActiveZone().catch(() => null),
      ]);

      return {
        rooms: roomsRes.items,
        tasks: tasksRes.items,
        activeZone: zoneRes ?? null,
      };
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
        await logout();
        return { rooms: [], tasks: [], activeZone: null as ActiveZoneResponse | null };
      }
      throw error;
    }
  };

  const householdQueryKey = ["household-data", activeHouseholdId] as const;

  const householdQuery = useQuery({
    queryKey: householdQueryKey,
    queryFn: fetchAll,
    enabled: !!user && !!activeHouseholdId && !authLoading,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    rooms: householdQuery.data?.rooms ?? [],
    tasks: householdQuery.data?.tasks ?? [],
    activeZone: householdQuery.data?.activeZone ?? null,
    isLoading: authLoading || householdQuery.isLoading,
    refetch: householdQuery.refetch,
    queryKey: householdQueryKey,
  };
};
