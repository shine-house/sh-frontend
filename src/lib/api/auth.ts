import { apiClient, tokenStorage } from "./client";
import type { UserResponse, AuthMeResponse, LoginResponse } from "./types/user-types";
import type { InfoMessage } from "./types/util-types";


export const signIn = async (email: string, password: string) => {
  const data = await apiClient.post<LoginResponse>("/auth/login", { email, password });
  tokenStorage.set(data.access_token);
  if (data.refresh_token) tokenStorage.setRefresh(data.refresh_token);
  return { user: data.user, active_household_id: data.active_household_id };
};

export const signUp = async (email: string, password: string, name: string) => {
  const data = await apiClient.post<UserResponse>("/auth/register", {
    email, password, name,
  });
  return data;
};

export const signOut = async () => {
  tokenStorage.clear();
};

export const getCurrentUser = async (): Promise<AuthMeResponse | null> => {
  if (!tokenStorage.get()) return null;
  try {
    return await apiClient.get<AuthMeResponse>("/auth/me");
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      tokenStorage.clear();
      localStorage.removeItem("sh_user");
      localStorage.removeItem("sh_active_household");
    }
    return null;
  }
};

export const forgotPassword = async (email: string): Promise<InfoMessage> => {
  return await apiClient.post<InfoMessage>("/auth/forgot-password", {
    email
  });

};

export const resetPassword = async (
  token: string,
  newPassword: string,
  confirmPassword: string,
): Promise<InfoMessage> => {
  const data = await apiClient.post<InfoMessage>(
    "/auth/reset-password",
    {
      token,
      new_password: newPassword,
      confirm_password: confirmPassword,
    },
  );

  return data;
};
