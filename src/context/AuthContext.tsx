
import React, { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser, signIn, signUp, signOut} from "@/lib/api/auth";
import type {UserResponse } from "@/lib/api/types/user-types";
import { toast } from "sonner";


type AuthContextType = {
  user: UserResponse | null;
  activeHouseholdId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  // loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [activeHouseholdId, setActiveHouseholdId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initial auth check: validate any stored token against the backend
  useEffect(() => {
      const initAuth = async () => {
        try {
          const session = await getCurrentUser();
          setUser(session?.user ?? null);
          setActiveHouseholdId(session?.active_household_id ?? null);
        } catch (error) {
          console.error("Erro ao verificar sessão:", error);
          setUser(null);
          setActiveHouseholdId(null);
        } finally {
          setIsLoading(false);
        }
      };
      initAuth();
    }, []);

 const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: verificar retorno
      const { user: authUser, active_household_id } = await signIn(email, password);
      if (!authUser) {
        throw new Error("Falha na autenticação. Tente novamente.");
      }
      setUser(authUser);
      setActiveHouseholdId(active_household_id);
      toast.success(`Bem-vindo, ${authUser.name || authUser.email.split('@')[0]}!`);
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Add google integration
  //   const loginWithGoogle = async () => {
  //   setIsLoading(true);
  //   try {
  //     console.log("Iniciando login com Google");
  //     const apiUrl = import.meta.env.VITE_API_URL;
  //     // OAuth is redirect-based: the FastAPI backend handles the provider
  //     // handshake and redirects back with a session token.
  //     window.location.href = `${apiUrl}/auth/google`;
  //   } catch (error) {
  //     console.error("Exceção no login com Google:", error);
  //     setIsLoading(false);
  //     throw error;
  //   }
  // };

    const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log("Registrando novo usuário:", email, name);

      const data = await signUp(email, password, name);

      console.log("Registro concluído:", data);
      toast.success(data.message || "Email de confirmação enviado! Verifique sua caixa de entrada.", {
        duration: 5000,
      });

    } catch (error: any) {
      console.error("Erro no registro:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log("Fazendo logout");
      await signOut();
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao sair da conta");
    }
  };

return (
    <AuthContext.Provider
      value={
        { user, 
          activeHouseholdId, 
          isAuthenticated: !!user, 
          isLoading, 
          login, 
          register, 
          logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
