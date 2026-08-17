import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTasksApi } from "@/lib/api/tasks";
import { createRoomsApi } from "@/lib/api/rooms";
import { createZonesApi } from "@/lib/api/zones";
import type { UpdateRoomRequest } from "@/lib/api/types/room-types";
import type { TaskCreate, TaskUpdate } from "@/lib/api/types/task-types";
import { useAuth } from "@/context/AuthContext";

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
      if (!roomsApi || !zonesApi) return;
      await roomsApi.reorderRooms({ room_ids: roomIds });
      await zonesApi.getActiveZone().catch(() => null);
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao reordenar cômodos"),
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
    mutationFn: async ({ id, isAvailable, lastExecutionId }: { id: string; isAvailable: boolean; lastExecutionId?: string | null }) => {
      if (!tasksApi) return;

      if (isAvailable) {
        await tasksApi.completeTask(id);
      } else if (lastExecutionId) {
        await tasksApi.uncompleteTask(lastExecutionId);
      }
    },
    onSuccess: invalidateHouseholdData,
    onError: () => toast.error("Erro ao atualizar tarefa"),
  });

  return {
    addRoom: (name: string) => addRoomMutation.mutateAsync(name),
    reorderRooms: (roomIds: string[]) => reorderRoomsMutation.mutateAsync(roomIds),
    editRoom: (id: string, data: UpdateRoomRequest) => editRoomMutation.mutateAsync({ id, data }),
    removeRoom: (id: string) => removeRoomMutation.mutateAsync(id),
    addTask: (data: TaskCreate) => addTaskMutation.mutateAsync(data),
    editTask: (id: string, data: TaskUpdate) => editTaskMutation.mutateAsync({ id, data }),
    removeTask: (id: string) => removeTaskMutation.mutateAsync(id),
    toggleTaskStatus: (id: string, isAvailable: boolean, lastExecutionId?: string | null) =>
      toggleTaskStatusMutation.mutateAsync({ id, isAvailable, lastExecutionId }),
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
