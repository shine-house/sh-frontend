import { apiClient } from "./client";

export const createHouseholdApi = (householdId: string) => {
  const basePath = `/households/${householdId}`;

  return {
    deleteAccountData: () =>
      apiClient.delete<void>(`${basePath}`),
  };
};

export type HouseholdApi = ReturnType<typeof createHouseholdApi>;