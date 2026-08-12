import { apiClient, tokenStorage } from "./client";
import type { UserResponse, AuthMeResponse, LoginResponse} from "./types/user";


export const signIn = async (email: string, password: string) => {
  const data = await apiClient.post<LoginResponse>("/auth/login", { email, password });
  tokenStorage.set(data.access_token);
  return { user: data.user };
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
  } catch {
    return null;
  }
};