import { apiClient } from "./client";
import type { ActiveZoneResponse } from "@/lib/api/types/zone-types";

export const createZonesApi = (householdId: string) => {
  const basePath = `/households/${householdId}`;

  return {

    getActiveZone: () =>
      apiClient.get<ActiveZoneResponse>(`${basePath}/active-zone`),
  };
};

export type ZonesApi = ReturnType<typeof createZonesApi>;