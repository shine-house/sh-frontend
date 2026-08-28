import { apiClient } from "./client";
import type { UserResponse, AuthMeResponse } from "./types/user-types";
import type { InfoMessage } from "./types/util-types";

export const signIn = async (email: string, password: string) => {
  const data = await apiClient.post<AuthMeResponse>("/auth/login", { email, password });
  return { user: data.user, active_household_id: data.active_household_id };
};

export const signUp = async (email: string, password: string, name: string) => {
  return await apiClient.post<UserResponse>("/auth/register", { email, password, name });
};

export const signOut = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};

export const getCurrentUser = async (): Promise<AuthMeResponse | null> => {
  try {
    return await apiClient.get<AuthMeResponse>("/auth/me");
  } catch {
    return null;
  }
};

export const forgotPassword = async (email: string): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/forgot-password", { email });

export const resetPassword = async (
  token: string, newPassword: string, confirmPassword: string,
): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/reset-password", {
    token, new_password: newPassword, confirm_password: confirmPassword,
  });