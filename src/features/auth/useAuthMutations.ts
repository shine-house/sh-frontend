import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, signOut } from "@/lib/api/auth";
import { toast } from "sonner";

const USER_KEY = "sh_user";
const HOUSEHOLD_KEY = "sh_active_household";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Deixe o erro estourar aqui caso a API retorne status 4xx/5xx
      const data = await signIn(email, password);

      // Validação extra caso sua API retorne 200 mas sem os dados do usuário
      if (!data || !data.user) {
        throw new Error("Usuário não encontrado na resposta do servidor.");
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

  // CORREÇÃO CRÍTICA: Captura e relança o erro da mutation para o componente visual saber que falhou
  const login = async (email: string, password: string) => {
    try {
      return await loginMutation.mutateAsync({ email, password });
    } catch (error) {
      // Relança o erro HTTP original para o bloco catch do AuthDialog/AuthPage
      throw error;
    }
  };

  // CORREÇÃO CRÍTICA: Captura e relança o erro de cadastro
  const register = async (email: string, password: string, name: string) => {
    try {
      return await registerMutation.mutateAsync({ email, password, name });
    } catch (error) {
      throw error;
    }
  };

  return {
    login: async (email: string, password: string) => {
      const result = await loginMutation.mutateAsync({ email, password });
      return result;
    },
    register: async (email: string, password: string, name: string) => {
      const result = await registerMutation.mutateAsync({ email, password, name });
      return result;
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    isLoading:
      loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
  };
};
