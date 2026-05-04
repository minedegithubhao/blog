import type { ApiResult } from "@/types/api";
import type { PageResult } from "@/types/page";
import { getAuthHeaders } from "@/modules/auth/utils/auth-storage";
import type { FileQuery, FileRecord } from "../types/file-record";

async function parseResult<T>(response: Response): Promise<T> {
  const result = (await response.json()) as ApiResult<T>;
  if (!response.ok || result.code !== 200) {
    throw new Error(result.message || "请求失败");
  }
  return result.data;
}

export async function uploadFile(file: File): Promise<FileRecord> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/v1/files/upload", {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData
  });
  return parseResult<FileRecord>(response);
}

export async function listFiles(query: FileQuery): Promise<PageResult<FileRecord>> {
  const params = new URLSearchParams({
    page: String(query.page),
    pageSize: String(query.pageSize)
  });
  if (query.filename) {
    params.set("filename", query.filename);
  }
  if (query.contentType) {
    params.set("contentType", query.contentType);
  }

  const response = await fetch(`/api/v1/files?${params.toString()}`, {
    headers: getAuthHeaders()
  });
  return parseResult<PageResult<FileRecord>>(response);
}

export async function deleteFile(id: number): Promise<void> {
  const response = await fetch(`/api/v1/files/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  await parseResult<null>(response);
}
