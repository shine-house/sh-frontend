
import React, { createContext, useContext, useEffect } from "react";
import type { UserResponse } from "@/lib/api/types/user-types";
import { useAuthSession } from "@/features/auth/useAuthSession";
import { useAuthMutations } from "@/features/auth/useAuthMutations";
import CleaningLoader from "@/components/CleaningLoader";

type AuthContextType = {
  user: UserResponse | null;
  activeHouseholdId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: UserResponse; active_household_id: string | null }>;
  register: (email: string, password: string, name: string) => Promise<UserResponse>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const USER_KEY = "sh_user";
  const HOUSEHOLD_KEY = "sh_active_household";
  const { login, register, logout, isLoading: mutationsLoading } = useAuthMutations();
  const sessionQuery = useAuthSession();

  const user = sessionQuery.data?.user ?? null;
  const activeHouseholdId = sessionQuery.data?.active_household_id ?? null;

  useEffect(() => {
    if (sessionQuery.data?.user) {
      localStorage.setItem(USER_KEY, JSON.stringify(sessionQuery.data.user));

      if (sessionQuery.data.active_household_id) {
        localStorage.setItem(HOUSEHOLD_KEY, sessionQuery.data.active_household_id);
      } else {
        localStorage.removeItem(HOUSEHOLD_KEY);
      }
      return;
    }

    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(HOUSEHOLD_KEY);
  }, [sessionQuery.data]);

  const isLoading = sessionQuery.isLoading || mutationsLoading;

  if (isLoading) {
    return <CleaningLoader />
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        activeHouseholdId,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
