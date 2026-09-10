import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAccount } from "@/lib/api/auth";
import type { DeleteAccountRequest } from "@/lib/api/types/auth-types";

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteAccountRequest) => deleteAccount(payload),
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["household"] });
      queryClient.removeQueries({ queryKey: ["rooms"] });
      queryClient.removeQueries({ queryKey: ["tasks"] });
    },
  });
};