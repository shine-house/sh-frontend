import type { ErrorResponse } from "./types/util-types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TOKEN_KEY = "access_token";

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
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

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401) {
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