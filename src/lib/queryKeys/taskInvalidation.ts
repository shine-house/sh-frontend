import type { QueryClient } from "@tanstack/react-query";
import type { TaskTypeEnum } from "@/lib/api/types/util-types";
import type { TaskQueryFilters } from "@/lib/queryKeys/taskKeys";
import type { ListTaskWithStatusResponse, TaskWithStatus } from "@/lib/api/types/task-types";


const matchesTaskQuery = (queryKey: readonly unknown[], householdId: string) =>
  queryKey[0] === "tasks" && queryKey[1] === householdId;


export const getAllTaskQueriesData = (queryClient: QueryClient, householdId: string) =>
  queryClient.getQueriesData<ListTaskWithStatusResponse>({
    predicate: (query) => matchesTaskQuery(query.queryKey, householdId),
  });

export const restoreTaskQueriesData = (
    queryClient: QueryClient,
    snapshot: ReturnType<typeof getAllTaskQueriesData>
  ) => {
    snapshot.forEach(([queryKey, data]) => {
      queryClient.setQueryData(queryKey, data);
    });
  };

export const setTaskInAllCaches = (
  queryClient: QueryClient,
  householdId: string,
  taskId: string,
  updater: (task: TaskWithStatus) => TaskWithStatus
) => {
  queryClient.setQueriesData<ListTaskWithStatusResponse>(
    { predicate: (query) => matchesTaskQuery(query.queryKey, householdId) },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((item) => (item.id === taskId ? updater(item) : item)),
      };
    }
  );
};

export const invalidateTasksByRoom = (queryClient: QueryClient, householdId: string, roomId: string) =>
  queryClient.invalidateQueries({
    predicate: (query) => {
      if (!matchesTaskQuery(query.queryKey, householdId)) return false;
      const filters = query.queryKey[2] as TaskQueryFilters | undefined;
      return filters?.roomId === roomId;
    },
  });
  
export const invalidateTasksByType = (queryClient: QueryClient, householdId: string, type: TaskTypeEnum) =>
  queryClient.invalidateQueries({
    predicate: (query) => {
      if (!matchesTaskQuery(query.queryKey, householdId)) return false;
      const filters = query.queryKey[2] as TaskQueryFilters | undefined;
      return filters?.type === type;
    },
  });


const matchesFilterForTask = (
  filters: TaskQueryFilters | undefined,
  type: TaskTypeEnum,
  roomId: string
) => {
  if (!filters) return false;
  if (filters.type && filters.type !== type) return false;
  if (filters.roomId && filters.roomId !== roomId) return false;
 
  return true;
};


export const addOptimisticTaskToCaches = (
  queryClient: QueryClient,
  householdId: string,
  task: TaskWithStatus
) => {
  queryClient.setQueriesData<ListTaskWithStatusResponse>(
    {
      predicate: (query) => {
        if (!matchesTaskQuery(query.queryKey, householdId)) return false;
        const filters = query.queryKey[2] as TaskQueryFilters | undefined;
        if (!filters || filters.page !== 1) return false;
        return matchesFilterForTask(filters, task.type, task.room_id);
      },
    },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: [task, ...old.items],
        metadata: {
          ...old.metadata,
          total_items: old.metadata.total_items + 1,
        },
      };
    }
  );
};


export const removeTaskFromCaches = (
  queryClient: QueryClient,
  householdId: string,
  taskId: string,
  type: TaskTypeEnum,
  roomId: string
) => {
  queryClient.setQueriesData<ListTaskWithStatusResponse>(
    {
      predicate: (query) => {
        if (!matchesTaskQuery(query.queryKey, householdId)) return false;
        const filters = query.queryKey[2] as TaskQueryFilters | undefined;
        return matchesFilterForTask(filters, type, roomId);
      },
    },
    (old) => {
      if (!old) return old;
      if (!old.items.some((item) => item.id === taskId)) return old;
      return {
        ...old,
        items: old.items.filter((item) => item.id !== taskId),
        metadata: {
          ...old.metadata,
          total_items: Math.max(0, old.metadata.total_items - 1),
        },
      };
    }
  );
};

export const replaceOptimisticTaskInCaches = (
  queryClient: QueryClient,
  householdId: string,
  optimisticId: string,
  serverTask: TaskWithStatus
) => {
  queryClient.setQueriesData<ListTaskWithStatusResponse>(
    {
      predicate: (query) => {
        if (!matchesTaskQuery(query.queryKey, householdId)) return false;
        const filters = query.queryKey[2] as TaskQueryFilters | undefined;
        return matchesFilterForTask(filters, serverTask.type, serverTask.room_id);
      },
    },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        items: old.items.map((item) => (item.id === optimisticId ? serverTask : item)),
      };
    }
  );
};