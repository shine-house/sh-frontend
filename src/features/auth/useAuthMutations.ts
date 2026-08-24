import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, signOut } from "@/lib/api/auth";
import { toast } from "sonner";

const USER_KEY = "sh_user";
const HOUSEHOLD_KEY = "sh_active_household";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const data = await signIn(email, password);
      if (!data || !data.user) {
        throw new Error("Crendenciais inválidas.");
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth", "me"], {
        user: data.user,
        active_household_id: data.active_household_id,
      });

      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      if (data.active_household_id) {
        localStorage.setItem(HOUSEHOLD_KEY, data.active_household_id);
      } else {
        localStorage.removeItem(HOUSEHOLD_KEY);
      }

      toast.success(`Bem-vindo, ${data.user.name || data.user.email.split("@")[0]}!`);
    },
    onError: () => {
      queryClient.setQueryData(["auth", "me"], null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(HOUSEHOLD_KEY);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, name }: { email: string; password: string; name: string }) =>
      signUp(email, password, name),
    onSuccess: () => {
      toast.success("Email de confirmação enviado! Verifique sua caixa de entrada.", {
        duration: 5000,
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(HOUSEHOLD_KEY);
    },
    onError: () => {
      toast.error("Erro ao sair da conta");
    },
  });

  return {
    login: (email: string, password: string) =>
      loginMutation.mutateAsync({ email, password }),
    register: (email: string, password: string, name: string) =>
      registerMutation.mutateAsync({ email, password, name }),
    logout: () => logoutMutation.mutateAsync(),
    isLoading:
      loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
};
