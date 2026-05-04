"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Eye, FileImage, RefreshCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDashboardAccess } from "@/modules/dashboard/components/dashboard-access-context";
import { deleteFile, listFiles, uploadFile } from "../api/file-api";
import type { FileQuery, FileRecord } from "../types/file-record";

export function FileManagementPage() {
  const { permissions } = useDashboardAccess();
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);
  const canUpload = permissionSet.has("file:upload");
  const canDelete = permissionSet.has("file:delete");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState<FileQuery>({ page: 1, pageSize: 10 });
  const [records, setRecords] = useState<FileRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteRecord, setConfirmDeleteRecord] = useState<FileRecord | null>(null);
  const [detailRecord, setDetailRecord] = useState<FileRecord | null>(null);

  async function fetchPage(nextQuery = query) {
    setLoading(true);
    try {
      const result = await listFiles(nextQuery);
      setRecords(result.list);
      setTotal(result.total);
      setQuery({ ...nextQuery, page: result.page, pageSize: result.pageSize });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载文件失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchPage(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUploadChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      await uploadFile(file);
      toast.success("文件上传成功");
      await fetchPage({ ...query, page: 1 });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "文件上传失败");
    } finally {
      setUploading(false);
    }
  }

  async function executeDelete() {
    if (!confirmDeleteRecord) {
      return;
    }

    setDeleting(true);
    try {
      await deleteFile(confirmDeleteRecord.id);
      toast.success("文件删除成功");
      await fetchPage(query);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "文件删除失败");
    } finally {
      setDeleting(false);
      setConfirmDeleteRecord(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / query.pageSize));
  const visiblePages = buildVisiblePages(query.page, totalPages);

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <Card className="min-w-0 rounded-md">
        <CardContent className="min-w-0 pt-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Label className="whitespace-nowrap text-sm text-[#666]">文件名称</Label>
              <div className="w-full min-w-0 sm:w-[220px]">
                <Input
                  value={query.filename ?? ""}
                  placeholder="请输入文件名"
                  onChange={(event) => setQuery((current) => ({ ...current, filename: event.target.value }))}
                />
              </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Label className="whitespace-nowrap text-sm text-[#666]">文件类型</Label>
              <div className="w-full min-w-0 sm:w-[220px]">
                <Input
                  value={query.contentType ?? ""}
                  placeholder="请输入 contentType"
                  onChange={(event) => setQuery((current) => ({ ...current, contentType: event.target.value }))}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" className="cursor-pointer" onClick={() => void fetchPage({ ...query, page: 1 })}>
                查询
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  const emptyQuery = { page: 1, pageSize: query.pageSize };
                  setQuery(emptyQuery);
                  void fetchPage(emptyQuery);
                }}
              >
                重置
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="min-w-0 rounded-md">
        <CardContent className="min-w-0 pt-0">
          <div className="mb-4 flex items-center gap-3">
            {canUpload ? (
              <>
                <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" className="hidden" onChange={handleUploadChange} />
                <Button type="button" variant="outline" className="cursor-pointer border-primary text-primary hover:text-primary" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                  <Upload className="h-4 w-4" aria-hidden="true" />
                  {uploading ? "上传中..." : "上传文件"}
                </Button>
              </>
            ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>文件名称</TableHead>
                <TableHead>预览</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>类型</TableHead>
                <TableHead className="w-[132px] text-center">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    暂无文件
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="min-w-0 truncate" title={record.filename}>{record.filename}</div>
                    </TableCell>
                    <TableCell>
                      <a href={record.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileImage className="h-4 w-4" />
                          <span className="truncate">打开文件</span>
                        </div>
                      </a>
                    </TableCell>
                    <TableCell><div className="truncate">{formatSize(record.size)}</div></TableCell>
                    <TableCell><div className="truncate" title={record.contentType || "-"}>{record.contentType || "-"}</div></TableCell>
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer text-[#606266] hover:text-primary"
                        onClick={() => setDetailRecord(record)}
                        title={`查看 ${record.filename}`}
                      >
                        <Eye className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      {canDelete ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="cursor-pointer text-destructive hover:text-destructive"
                          onClick={() => setConfirmDeleteRecord(record)}
                          title={`删除 ${record.filename}`}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
            <span>共 {total} 条</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="icon" className="cursor-pointer" onClick={() => void fetchPage(query)}>
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Pagination className="mx-0 w-auto justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={classNames("cursor-pointer", query.page <= 1 && "pointer-events-none opacity-50")}
                      onClick={() => void fetchPage({ ...query, page: query.page - 1 })}
                    />
                  </PaginationItem>
                  {visiblePages.map((item, index) => (
                    <PaginationItem key={item === "ellipsis" ? `ellipsis-${index}` : item}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink isActive={item === query.page} className="cursor-pointer" onClick={() => void fetchPage({ ...query, page: item })}>
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      className={classNames("cursor-pointer", query.page >= totalPages && "pointer-events-none opacity-50")}
                      onClick={() => void fetchPage({ ...query, page: query.page + 1 })}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={Boolean(confirmDeleteRecord)} onOpenChange={(open) => !open && setConfirmDeleteRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除文件</AlertDialogTitle>
            <AlertDialogDescription>删除后不可恢复，且被引用的页面会回退到默认图。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
            <AlertDialogAction className="cursor-pointer bg-destructive text-white hover:bg-destructive/90" onClick={() => void executeDelete()} disabled={deleting}>
              {deleting ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={Boolean(detailRecord)} onOpenChange={(open) => !open && setDetailRecord(null)}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>文件详情</DialogTitle>
          </DialogHeader>
          {detailRecord ? (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              {[
                ["文件名称", detailRecord.filename],
                ["访问地址", detailRecord.url],
                ["文件大小", formatSize(detailRecord.size)],
                ["文件类型", detailRecord.contentType || "-"],
                ["创建时间", formatDate(detailRecord.gmtCreate)],
                ["更新时间", formatDate(detailRecord.gmtModified)]
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 rounded-md border bg-muted/20 p-3">
                  <div className="text-xs text-muted-foreground">{label}</div>
                  <div className="min-w-0 break-all text-sm text-foreground">{value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function buildVisiblePages(currentPage: number, totalPages: number): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }
  if (currentPage >= totalPages - 3) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}

function formatSize(size: number) {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
  if (size >= 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${size} B`;
}
