import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, signOut } from "@/lib/api/auth";
import { toast } from "sonner";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await signIn(email, password);
      if (!data || !data.user) {
        throw new Error("Credenciais inválidas.");
      }
      return data;
    },
    onSuccess: async (data) => {
      queryClient.setQueryData(["auth", "me"], {
        user: data.user,
        active_household_id: data.active_household_id,
      });
      await queryClient.invalidateQueries({ queryKey: ["household"] });
      await queryClient.invalidateQueries({ queryKey: ["rooms"] });
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });

      toast.success(`Bem-vindo, ${data.user.name || data.user.email.split("@")[0]}!`);
    },
    onError: () => {
      queryClient.setQueryData(["auth", "me"], null);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      signUp(email, password, name),
    onSuccess: () => {
      toast.success("Email de confirmação enviado! Verifique sua caixa de entrada.", { duration: 5000 });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: async () => {
      queryClient.setQueryData(["auth", "me"], null);
      queryClient.removeQueries({ queryKey: ["household"] });
      queryClient.removeQueries({ queryKey: ["rooms"] });
      queryClient.removeQueries({ queryKey: ["tasks"] });
    },
    onError: () => {
      toast.error("Erro ao sair da conta");
    },
  });

  return {
    login: (email: string, password: string) => loginMutation.mutateAsync({ email, password }),
    register: (email: string, password: string, name: string) => registerMutation.mutateAsync({ email, password, name }),
    logout: () => logoutMutation.mutateAsync(),
    isLoading: loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
};