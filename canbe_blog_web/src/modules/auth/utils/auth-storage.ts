import type { CurrentUser, LoginResponse } from "../types/auth";

const TOKEN_KEY = "canbe_blog_token";
const USER_KEY = "canbe_blog_user";

export function getAuthToken(): string {
  if (typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function getStoredUser(): CurrentUser | null {
  if (typeof window === "undefined") {
    return null;
  }
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }
  try {
    return JSON.parse(rawUser) as CurrentUser;
  } catch {
    return null;
  }
}

export function saveLoginSession(loginResponse: LoginResponse) {
  localStorage.setItem(TOKEN_KEY, loginResponse.token);
  localStorage.setItem(USER_KEY, JSON.stringify(loginResponse.user));
}

export function saveCurrentUser(user: CurrentUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearLoginSession() {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthHeaders(includeJson = false): HeadersInit {
  const token = getAuthToken();
  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}
