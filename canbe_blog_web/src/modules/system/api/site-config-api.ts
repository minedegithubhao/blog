import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { ApiResult } from "@/types/api";
import type { SiteConfig, SiteConfigPayload } from "../types/site-config";

const apiBaseUrl = process.env.BLOG_API_BASE_URL || "http://localhost:18080";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const url = typeof window === "undefined" ? `${apiBaseUrl}/api/v1/site-config` : "/api/v1/site-config";
  const response = await fetch(url, { cache: "no-store" });
  return parseResult<SiteConfig>(response);
}

export async function updateSiteConfig(payload: SiteConfigPayload): Promise<void> {
  const response = await fetch("/api/v1/site-config", {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(payload)
  });
  await parseResult<null>(response);
}
