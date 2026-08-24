import type { ErrorResponse } from "./types/util-types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  get: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
  getRefresh: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefresh: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};


export class ApiError extends Error {
  public readonly status: number;
  public readonly data: ErrorResponse;

  constructor(status: number, data: ErrorResponse) {
    super(data.message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {

  const token = tokenStorage.get();
  const retryFlag = (options as any)?._retry === true;
  const isAuthEndpoint = path.startsWith("/auth/login") || path.startsWith("/auth/register");
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 && !retryFlag && !isAuthEndpoint) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return request<T>(path, { ...(options as any), _retry: true } as RequestInit);
      }
      tokenStorage.clear();
    }

    const body = await res.json().catch(() => null);

    if (body) {
      throw new ApiError(res.status, body);
    }

    throw new ApiError(res.status, {
      error_code: "UNKNOWN_ERROR",
      message: res.statusText || "Erro inesperado.",
      request_id: "",
      timestamp: new Date().toISOString(),
    });
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) return false;

    const data = await res.json().catch(() => null);
    if (!data || !data.access_token) return false;

    tokenStorage.set(data.access_token);
    if (data.refresh_token) tokenStorage.setRefresh(data.refresh_token);

    return true;
  } catch (e) {
    return false;
  }
}

export const apiClient = {
  get: <T>(path: string) =>
    request<T>(path, {
      method: "GET",
    }),

  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

    put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),
};