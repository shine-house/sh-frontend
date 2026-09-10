import type { ErrorResponse } from "./types/util-types";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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

interface RequestOptions extends RequestInit {
  _retry?: boolean;
}

let refreshInFlight: Promise<boolean> | null = null;

const AUTH_ENDPOINTS_NO_REFRESH = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
];


async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { _retry, ...fetchOptions } = options;
  const isExemptFromRefresh = AUTH_ENDPOINTS_NO_REFRESH.some((p) => path.startsWith(p));

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    if (res.status === 401 && !_retry && !isExemptFromRefresh) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return request<T>(path, { ...options, _retry: true });
      }
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
  if (refreshInFlight) {
    return refreshInFlight;
  }

  refreshInFlight = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body !== undefined ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "DELETE", body: body !== undefined ? JSON.stringify(body) : undefined }),
};