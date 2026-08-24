import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createTasksApi } from "@/lib/api/tasks";
import { createRoomsApi } from "@/lib/api/rooms";
import { createZonesApi } from "@/lib/api/zones";
import type { UpdateRoomRequest } from "@/lib/api/types/room-types";
import type { TaskCreate, TaskUpdate } from "@/lib/api/types/task-types";

export const useTaskMutations = () => {
  const { activeHouseholdId } = useAuth();
  const queryClient = useQueryClient();

  const tasksApi = activeHouseholdId ? createTasksApi(activeHouseholdId) : null;
  const roomsApi = activeHouseholdId ? createRoomsApi(activeHouseholdId) : null;
  const zonesApi = activeHouseholdId ? createZonesApi(activeHouseholdId) : null;

  const invalidateHouseholdData = async () => {
    if (!activeHouseholdId) return;
    await queryClient.invalidateQueries({
      queryKey: ["household-data", activeHouseholdId],
      exact: true,
    });
  };

  const addRoomMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!roomsApi) return;
      await roomsApi.createRoom({ name });
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao criar cômodo"),
  });

    const reorderRoomsMutation = useMutation({
    mutationFn: async (roomIds: string[]) => {
      if (!roomsApi || !zonesApi) {
        throw new Error("Household not ready");
      }
      await roomsApi.reorderRooms({ room_ids: roomIds });
      await zonesApi.getActiveZone().catch(() => null);
    },
    onMutate: async (roomIds: string[]) => {
      if (!activeHouseholdId) return;
      const queryKey = ["household-data", activeHouseholdId] as const;
      await queryClient.cancelQueries({ queryKey, exact: true });

      const previous = queryClient.getQueryData<any>(queryKey);

      queryClient.setQueryData(queryKey, (old: any) => {
        if (!old) return old;
        const positionById = new Map(roomIds.map((id, idx) => [id, idx + 1]));
        return {
          ...old,
          rooms: old.rooms.map((room: any) => ({
            ...room,
            zone_cycle_position: positionById.get(room.id) ?? room.zone_cycle_position,
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _roomIds, context) => {
      if (context?.previous && activeHouseholdId) {
        queryClient.setQueryData(["household-data", activeHouseholdId], context.previous);
      }
      toast.error("Erro ao reordenar cômodos");
    },
    onSuccess: invalidateHouseholdData,
  });

  const editRoomMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRoomRequest }) => {
      if (!roomsApi) return;
      await roomsApi.updateRoom(id, data);
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao editar cômodo"),
  });

  const removeRoomMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!roomsApi) return;
      await roomsApi.deleteRoom(id);
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao remover cômodo"),
  });

  const addTaskMutation = useMutation({
    mutationFn: async (data: TaskCreate) => {
      if (!tasksApi) return;
      await tasksApi.createTask(data);
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao criar tarefa"),
  });

  const editTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TaskUpdate }) => {
      if (!tasksApi) return;
      await tasksApi.updateTask(id, data);
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao editar tarefa"),
  });

  const removeTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!tasksApi) return;
      await tasksApi.deleteTask(id);
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao remover tarefa"),
  });

  const toggleTaskStatusMutation = useMutation({
    mutationFn: async ({ id, isAvailable}: { id: string; isAvailable: boolean}) => {
      if (!tasksApi) return;

      if (isAvailable) {
        await tasksApi.completeTask(id);
      } else if (id) {
        await tasksApi.uncompleteTask(id);
      }
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao atualizar tarefa"),
  });

  return {
    addRoom: async (name: string) => addRoomMutation.mutateAsync(name),
    reorderRooms: async (roomIds: string[]) => reorderRoomsMutation.mutateAsync(roomIds),
    editRoom: async (id: string, data: UpdateRoomRequest) => editRoomMutation.mutateAsync({ id, data }),
    removeRoom: async (id: string) => removeRoomMutation.mutateAsync(id),
    addTask: async (data: TaskCreate) => addTaskMutation.mutateAsync(data),
    editTask: async (id: string, data: TaskUpdate) => editTaskMutation.mutateAsync({ id, data }),
    removeTask: async (id: string) => removeTaskMutation.mutateAsync(id),
    toggleTaskStatus: async (id: string, isAvailable: boolean) =>
      toggleTaskStatusMutation.mutateAsync({ id, isAvailable}),
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
