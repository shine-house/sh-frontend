import { useTasksQuery } from "./useTasksQuery";

export const useRoomTaskCounts = (roomId: string) => {
  const zone = useTasksQuery({ roomId, type: "zone", page: 1, size: 1 });
  const weekly = useTasksQuery({ roomId, type: "weekly", page: 1, size: 1 });
  return {
    zoneCount: zone.metadata?.total_items ?? 0,
    weeklyCount: weekly.metadata?.total_items ?? 0,
  };
};