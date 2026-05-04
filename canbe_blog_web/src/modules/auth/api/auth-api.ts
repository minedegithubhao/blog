import type { ApiResult } from "@/types/api";
import type { CurrentUser, LoginPayload, LoginResponse, RegisterPayload } from "../types/auth";
import { getAuthHeaders } from "../utils/auth-storage";

const AUTH_CHECK_TIMEOUT_MS = 4000;

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = (await response.json()) as ApiResult<LoginResponse | null>;
  if (!response.ok || result.code !== 200 || !result.data) {
    throw new Error(result.message || "登录失败");
  }
  return result.data;
}

export async function register(payload: RegisterPayload): Promise<number> {
  const response = await fetch("/api/v1/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const result = (await response.json()) as ApiResult<number | null>;
  if (!response.ok || result.code !== 200 || typeof result.data !== "number") {
    throw new Error(result.message || "注册失败");
  }
  return result.data;
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), AUTH_CHECK_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch("/api/v1/me", {
      headers: getAuthHeaders(),
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeoutId);
  }

  const result = (await response.json()) as ApiResult<CurrentUser | null>;
  if (!response.ok || result.code !== 200 || !result.data) {
    throw new Error(result.message || "请先登录");
  }
  return result.data;
}

export async function logout(): Promise<void> {
  const response = await fetch("/api/v1/auth/logout", {
    method: "POST",
    headers: getAuthHeaders()
  });

  const result = (await response.json()) as ApiResult<null>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "退出登录失败");
  }
}
