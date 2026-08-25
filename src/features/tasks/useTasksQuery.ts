import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createTasksApi } from "@/lib/api/tasks";
import { taskKeys, DEFAULT_PAGE, DEFAULT_SIZE, type TaskQueryFilters } from "@/lib/queryKeys/taskKeys";

export interface UseTasksQueryOptions extends TaskQueryFilters {
  enabled?: boolean;
}

export const useTasksQuery = ({
  roomId,
  type,
  page = DEFAULT_PAGE,
  size = DEFAULT_SIZE,
  enabled = true,
}: UseTasksQueryOptions) => {
  const { activeHouseholdId } = useAuth();
  const tasksApi = activeHouseholdId ? createTasksApi(activeHouseholdId) : null;

  const query = useQuery({
    queryKey: taskKeys.list(activeHouseholdId ?? "no-household", { roomId, type, page, size }),
    queryFn: async () => {
      if (!tasksApi) throw new Error("Household not ready");
      return tasksApi.listTasks({ roomId, type, page, size });
    },
    enabled: !!activeHouseholdId && enabled,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  return {
    tasks: query.data?.items ?? [],
    metadata: query.data?.metadata,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};