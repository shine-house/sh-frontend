import { apiClient } from "./client";
import type { AuthMeResponse } from "./types/user-types";
import type { InfoMessage } from "./types/util-types";
import type { ForgotPasswordRequest, RegisterRequest, ResendVerificationRequest, ResetPasswordRequest, VerifyEmailRequest } from "./types/auth-types";

export const signIn = async (email: string, password: string) => {
  const data = await apiClient.post<AuthMeResponse>("/auth/login", { email, password });
  return { user: data.user, active_household_id: data.active_household_id };
};

export const register = async (payload: RegisterRequest): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/register", payload);

export const verifyEmail = async (payload: VerifyEmailRequest): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/verify-email", payload);

export const resendVerification = async (payload: ResendVerificationRequest): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/resend-verification", payload);


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

export const forgotPassword = async (payload: ForgotPasswordRequest): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/forgot-password", payload);

export const resetPassword = async (payload: ResetPasswordRequest): Promise<InfoMessage> =>
  apiClient.post<InfoMessage>("/auth/reset-password", payload);