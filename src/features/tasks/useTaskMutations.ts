import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createTasksApi } from "@/lib/api/tasks";
import { createRoomsApi } from "@/lib/api/rooms";
import { createZonesApi } from "@/lib/api/zones";
import type { UpdateRoomRequest } from "@/lib/api/types/room-types";
import type { TaskCreate, TaskUpdate, TaskWithStatus } from "@/lib/api/types/task-types";
import type { TaskTypeEnum } from "@/lib/api/types/util-types";
import type { TaskMutationContext } from "@/context/task/types";
import { taskKeys } from "@/lib/queryKeys/taskKeys";
import { householdKeys } from "@/lib/queryKeys/householdKeys";
import {
  invalidateTasksByRoom,
  invalidateTasksByType,
  getAllTaskQueriesData,
  restoreTaskQueriesData,
  setTaskInAllCaches,
  addOptimisticTaskToCaches,
  removeTaskFromCaches,
  replaceOptimisticTaskInCaches
} from "@/lib/queryKeys/taskInvalidation";
import { createOptimisticTask } from "@/features/tasks/optimisticTask";

export const useTaskMutations = () => {
  const { activeHouseholdId } = useAuth();
  const queryClient = useQueryClient();

  const tasksApi = activeHouseholdId ? createTasksApi(activeHouseholdId) : null;
  const roomsApi = activeHouseholdId ? createRoomsApi(activeHouseholdId) : null;
  const zonesApi = activeHouseholdId ? createZonesApi(activeHouseholdId) : null;

  const invalidateRoomsAndZone = async () => {
    if (!activeHouseholdId) return;
    await queryClient.invalidateQueries({ queryKey: householdKeys.rooms(activeHouseholdId) });
  };

  const invalidateForTask = async (roomId: string, type: TaskTypeEnum) => {
    if (!activeHouseholdId) return;
    if (type === "zone") {
      await invalidateTasksByRoom(queryClient, activeHouseholdId, roomId);
      return;
    }
    await invalidateTasksByType(queryClient, activeHouseholdId, type);
  };


  const addRoomMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!roomsApi) throw new Error("Household not ready");
      await roomsApi.createRoom({ name });
    },
    onSuccess: invalidateRoomsAndZone,
    onError: () => toast.error("Erro ao criar cômodo"),
  });

  const reorderRoomsMutation = useMutation({
    mutationFn: async (roomIds: string[]) => {
      if (!roomsApi || !zonesApi) throw new Error("Household not ready");
      await roomsApi.reorderRooms({ room_ids: roomIds });
      await zonesApi.getActiveZone().catch(() => null);
    },
    onSuccess: invalidateRoomsAndZone,
    onError: () => toast.error("Erro ao reordenar cômodos"),
  });

  const editRoomMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoomRequest }) => {
      if (!roomsApi) throw new Error("Household not ready");
      await roomsApi.updateRoom(id, data);
    },
    onSuccess: invalidateRoomsAndZone,
    onError: () => toast.error("Erro ao editar cômodo"),
  });

  const removeRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!roomsApi) throw new Error("Household not ready");
      await roomsApi.deleteRoom(id);
    },
    onSuccess: invalidateRoomsAndZone,
    onError: () => toast.error("Erro ao remover cômodo"),
  });

const addTaskMutation = useMutation({
    mutationFn: async (data: TaskCreate) => {
      if (!tasksApi) throw new Error("Household not ready");
      const created = await tasksApi.createTask(data);
      const serverTask: TaskWithStatus = {
        ...created,
        is_available: true,
        last_completion: undefined,
      };
      return serverTask;
    },

    onMutate: async (data: TaskCreate) => {
      if (!activeHouseholdId) return;

      await queryClient.cancelQueries({
        predicate: (query) =>
          query.queryKey[0] === "tasks" && query.queryKey[1] === activeHouseholdId,
      });

      const previous = getAllTaskQueriesData(queryClient, activeHouseholdId);
      const optimisticTask = createOptimisticTask(data, activeHouseholdId);

      addOptimisticTaskToCaches(queryClient, activeHouseholdId, optimisticTask);

      return { previous, optimisticTask };
    },

    onSuccess: (serverTask, _variables, mutationContext) => {
      if (!activeHouseholdId || !mutationContext?.optimisticTask) return;

      replaceOptimisticTaskInCaches(
        queryClient,
        activeHouseholdId,
        mutationContext.optimisticTask.id,
        serverTask
      );
      void invalidateForTask(serverTask.room_id, serverTask.type);
    },

    onError: (_err, _variables, mutationContext) => {
      if (!activeHouseholdId || !mutationContext) return;

      const { optimisticTask } = mutationContext;
      removeTaskFromCaches(
        queryClient,
        activeHouseholdId,
        optimisticTask.id,
        optimisticTask.type,
        optimisticTask.room_id
      );

      toast.error("Erro ao criar tarefa");
    },
  });


  const editTaskMutation = useMutation({
     mutationFn: async ({ id, data, context }: { id: string; data: TaskUpdate; context: TaskMutationContext }) => {
      if (!tasksApi) throw new Error("Household not ready");
      const updated = await tasksApi.updateTask(id, data);
      return { context, updated };
    },
    onSuccess: ({ context, updated }) => {
      void invalidateForTask(context.roomId, context.type);
      if (updated.room_id !== context.roomId || updated.type !== context.type) {
        void invalidateForTask(updated.room_id, updated.type);
      }
    },
    onError: () => toast.error("Erro ao editar tarefa"),
  });

  const removeTaskMutation = useMutation({
    mutationFn: async ({ id, context }: { id: string; context: TaskMutationContext }) => {
      if (!tasksApi) throw new Error("Household not ready");
      await tasksApi.deleteTask(id);
      return context;
    },
    onSuccess: ({ roomId, type }) => invalidateForTask(roomId, type),
    onError: () => toast.error("Erro ao remover tarefa"),
  });

 const toggleTaskStatusMutation = useMutation({
    mutationFn: async ({
      id,
      isAvailable,
      context,
    }: {
      id: string;
      isAvailable: boolean;
      context: TaskMutationContext;
    }) => {
      if (!tasksApi) throw new Error("Household not ready");
      if (isAvailable) {
        await tasksApi.completeTask(id);
      } else {
        await tasksApi.uncompleteTask(id);
      }
      return context;
    },

    onMutate: async ({ id, isAvailable }) => {
      if (!activeHouseholdId) return;

      await queryClient.cancelQueries({ queryKey: taskKeys.all(activeHouseholdId) });

      const previous = getAllTaskQueriesData(queryClient, activeHouseholdId);
      const nextIsAvailable = !isAvailable;

      setTaskInAllCaches(queryClient, activeHouseholdId, id, (task) => ({
        ...task,
        is_available: nextIsAvailable,
        last_completion: nextIsAvailable ? undefined : task.last_completion,
      }));

      return { previous };
    },

    onSuccess: ({ roomId, type }) => invalidateForTask(roomId, type),

    onError: (_err, _vars, mutationContext) => {
      if (activeHouseholdId && mutationContext?.previous) {
        restoreTaskQueriesData(queryClient, mutationContext.previous);
      }
      toast.error("Erro ao atualizar tarefa");
    },
  });

  return {
    addRoom: async (name: string) => addRoomMutation.mutateAsync(name),
    reorderRooms: async (roomIds: string[]) => reorderRoomsMutation.mutateAsync(roomIds),
    editRoom: async (id: string, data: UpdateRoomRequest) => editRoomMutation.mutateAsync({ id, data }),
    removeRoom: async (id: string) => removeRoomMutation.mutateAsync(id),

    addTask: async (data: TaskCreate) => addTaskMutation.mutateAsync(data),
    editTask: async (id: string, data: TaskUpdate, context: TaskMutationContext) =>
      editTaskMutation.mutateAsync({ id, data, context }),
    removeTask: async (id: string, context: TaskMutationContext) =>
      removeTaskMutation.mutateAsync({ id, context }),
    toggleTaskStatus: async (id: string, isAvailable: boolean, context: TaskMutationContext) =>
      toggleTaskStatusMutation.mutateAsync({ id, isAvailable, context }),

    isLoading:
      addRoomMutation.isPending ||
      reorderRoomsMutation.isPending ||
      editRoomMutation.isPending ||
      removeRoomMutation.isPending ||
      addTaskMutation.isPending ||
      editTaskMutation.isPending ||
      removeTaskMutation.isPending ||
      toggleTaskStatusMutation.isPending,
  };
};