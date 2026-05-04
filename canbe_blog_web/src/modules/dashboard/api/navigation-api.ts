import type { ApiResult } from "@/types/api";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { CurrentUserNavigation } from "../types/navigation";

export async function getCurrentUserNavigation(): Promise<CurrentUserNavigation> {
  const response = await fetch("/api/v1/me/navigation", {
    headers: getAuthHeaders()
  });

  const result = (await response.json()) as ApiResult<CurrentUserNavigation | null>;
  if (!response.ok || result.code !== 200 || !result.data) {
    throw new Error(result.message || "加载导航失败");
  }
  return result.data;
}
