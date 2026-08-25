export const householdKeys = {
  rooms: (householdId: string) => ["rooms", householdId] as const,
  activeZone: (householdId: string) => ["active-zone", householdId] as const,
};