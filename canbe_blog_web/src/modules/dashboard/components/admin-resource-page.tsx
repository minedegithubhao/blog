"use client";

import { type FormEvent, useEffect, useMemo, useState, type ReactNode } from "react";
import { Edit3, Eye, Plus, RefreshCcw, Trash2 } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardAccess } from "@/modules/dashboard/components/dashboard-access-context";

type Primitive = string | number | number[] | undefined;
type FieldType = "input" | "number" | "select" | "textarea" | "password" | "hidden";

export type AdminResourceField = {
  name: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  disabledOnEdit?: boolean;
  hiddenOnEdit?: boolean;
  options?: Array<{ label: string; value: string | number }>;
  render?: (params: {
    field: AdminResourceField;
    value: unknown;
    values: Record<string, unknown>;
    editing: boolean;
    onChange: (value: Primitive) => void;
  }) => ReactNode;
};

export type AdminResourceColumn<T> = {
  title: string;
  dataIndex?: keyof T;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: unknown, record: T) => ReactNode;
};

export type AdminResourceDetailField<T> = {
  label: string;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T) => ReactNode;
};

export type AdminResourcePageProps<T extends { id?: number }> = {
  title: string;
  description?: string;
  searchFields?: AdminResourceField[];
  formFields: AdminResourceField[];
  columns: AdminResourceColumn<T>[];
  detailFields?: AdminResourceDetailField<T>[];
  defaultValues?: Partial<T>;
  pageSizeOptions?: number[];
  loadPage: (params: Record<string, Primitive> & { page: number; pageSize: number }) => Promise<{
    list: T[];
    total: number;
    page: number;
    pageSize?: number;
  }>;
  saveRecord: (editingRecord: T | null, form: Record<string, unknown>) => Promise<void>;
  deleteRecord?: (record: T) => Promise<void>;
  allowCreate?: boolean;
  allowEdit?: boolean;
  createPermission?: string;
  editPermission?: string;
  deletePermission?: string;
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function isWideFormField(field: AdminResourceField) {
  return field.type === "textarea" || /url|content|summary|description|remark|permission|component/i.test(field.name);
}

function normalizeValue(field: AdminResourceField, raw: string): Primitive {
  if (raw === "") {
    return undefined;
  }
  if (field.type === "number") {
    return Number(raw);
  }
  const option = field.options?.find((item) => String(item.value) === raw);
  return option ? option.value : raw;
}

function renderField({
  field,
  value,
  values,
  editing,
  onChange
}: {
  field: AdminResourceField;
  value: unknown;
  values: Record<string, unknown>;
  editing: boolean;
  onChange: (value: Primitive) => void;
}) {
  const currentValue = value === undefined || value === null ? "" : String(value);
  const disabled = editing && field.disabledOnEdit;

  if (field.render) {
    return field.render({ field, value, values, editing, onChange });
  }

  if (field.type === "hidden") {
    return <input type="hidden" value={currentValue} onChange={(event) => onChange(event.target.value)} />;
  }

  if (field.type === "textarea") {
    return <Textarea value={currentValue} disabled={disabled} onChange={(event) => onChange(event.target.value)} />;
  }

  if (field.type === "select") {
    return (
      <Select value={currentValue} disabled={disabled} onValueChange={(nextValue) => onChange(normalizeValue(field, nextValue))}>
        <SelectTrigger className="w-full cursor-pointer">
          <SelectValue placeholder="请选择" />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      type={field.type === "number" ? "number" : field.type === "password" ? "password" : "text"}
      value={currentValue}
      disabled={disabled}
      onChange={(event) => onChange(normalizeValue(field, event.target.value))}
    />
  );
}

export function StatusBadge({
  tone = "gray",
  children
}: {
  tone?: "green" | "red" | "blue" | "yellow" | "gray";
  children: ReactNode;
}) {
  const variants: Record<string, string> = {
    green: "bg-green-100 text-green-700 hover:bg-green-100",
    red: "bg-red-100 text-red-700 hover:bg-red-100",
    blue: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
    gray: "bg-muted text-muted-foreground hover:bg-muted"
  };

  return <Badge className={variants[tone]}>{children}</Badge>;
}

export function AdminResourcePage<T extends { id?: number }>({
  title,
  description,
  searchFields = [],
  formFields,
  columns,
  detailFields = [],
  defaultValues,
  pageSizeOptions = [10, 20, 50],
  loadPage,
  saveRecord,
  deleteRecord,
  allowCreate = true,
  allowEdit = true,
  createPermission,
  editPermission,
  deletePermission
}: AdminResourcePageProps<T>) {
  const { permissions } = useDashboardAccess();
  const [query, setQuery] = useState<Record<string, Primitive>>({});
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [records, setRecords] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeOptions[0] ?? 10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<T | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmDeleteRecord, setConfirmDeleteRecord] = useState<T | null>(null);
  const [confirmBatchDelete, setConfirmBatchDelete] = useState(false);
  const [detailRecord, setDetailRecord] = useState<T | null>(null);
  const [deleting, setDeleting] = useState(false);
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);
  const canCreate = allowCreate && (!createPermission || permissionSet.has(createPermission));
  const canEdit = allowEdit && (!editPermission || permissionSet.has(editPermission));
  const canDelete = Boolean(deleteRecord) && (!deletePermission || permissionSet.has(deletePermission));
  const showSelection = canDelete;
  const showDetail = detailFields.length > 0;
  const showOperation = showDetail || canEdit || canDelete;

  async function fetchPage(nextPage = page, nextPageSize = pageSize, nextQuery = query) {
    setLoading(true);
    try {
      const result = await loadPage({ ...nextQuery, page: nextPage, pageSize: nextPageSize });
      setRecords(result.list);
      setTotal(result.total);
      setPage(result.page);
      setPageSize(result.pageSize ?? nextPageSize);
      setSelectedIds([]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchPage(1, pageSize, query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modalTitle = useMemo(() => (editingRecord ? `编辑${title}` : `新增${title}`), [editingRecord, title]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const visiblePages = buildVisiblePages(page, totalPages);
  const allSelected = records.length > 0 && records.every((record) => typeof record.id === "number" && selectedIds.includes(record.id));

  async function handleSearch(event: FormEvent) {
    event.preventDefault();
    await fetchPage(1, pageSize, query);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      await saveRecord(editingRecord, form);
      toast.success(editingRecord ? `已更新${title}` : `已新增${title}`);
      setIsModalOpen(false);
      setEditingRecord(null);
      await fetchPage(editingRecord ? page : 1, pageSize, query);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(record: T) {
    setConfirmDeleteRecord(record);
  }

  async function executeDelete(record: T) {
    if (!deleteRecord) {
      return;
    }
    setDeleting(true);
    try {
      await deleteRecord(record);
      toast.success(`已删除${title}`);
      await fetchPage(page, pageSize, query);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "删除失败");
    } finally {
      setDeleting(false);
      setConfirmDeleteRecord(null);
    }
  }

  async function handleBatchDelete() {
    if (!selectedIds.length) {
      toast.warning(`请先选择要删除的${title}`);
      return;
    }
    setConfirmBatchDelete(true);
  }

  async function executeBatchDelete() {
    setDeleting(true);
    try {
      const selectedRecords = records.filter((record) => record.id && selectedIds.includes(record.id));
      let successCount = 0;
      const failedMessages: string[] = [];

      for (const record of selectedRecords) {
        try {
          if (deleteRecord) {
            await deleteRecord(record);
          }
          successCount += 1;
        } catch (error) {
          failedMessages.push(error instanceof Error ? error.message : `ID ${record.id} 删除失败`);
        }
      }

      if (failedMessages.length) {
        toast.warning(successCount > 0 ? `已删除 ${successCount} 条，${failedMessages[0]}` : failedMessages[0]);
      } else {
        toast.success(`已批量删除 ${successCount} 条${title}`);
      }

      await fetchPage(page, pageSize, query);
    } finally {
      setDeleting(false);
      setConfirmBatchDelete(false);
    }
  }

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <Card className="min-w-0 rounded-md">
        <CardContent className="min-w-0 pt-0">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4">
            {searchFields.map((field) => (
              <div key={field.name} className="flex min-w-0 flex-wrap items-center gap-2">
                <Label className="whitespace-nowrap text-sm text-[#666]">{field.label}</Label>
                <div className="w-full min-w-0 sm:w-[180px]">
                  {renderField({
                    field,
                    value: query[field.name],
                    values: query as Record<string, unknown>,
                    editing: false,
                    onChange: (value) => setQuery((current) => ({ ...current, [field.name]: value }))
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Button type="submit" className="cursor-pointer">
                查询
              </Button>
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => {
                  const emptyQuery = Object.fromEntries(searchFields.map((field) => [field.name, undefined])) as Record<string, Primitive>;
                  setQuery(emptyQuery);
                  void fetchPage(1, pageSize, emptyQuery);
                }}
              >
                重置
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="min-w-0 rounded-md">
        <CardContent className="min-w-0 pt-0">
          {description ? <p className="mb-4 text-sm text-muted-foreground">{description}</p> : null}

          <div className="mb-4 flex items-center gap-3">
            {canCreate ? (
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer border-primary text-primary hover:text-primary"
                onClick={() => {
                  setEditingRecord(null);
                  setForm({ ...(defaultValues as Record<string, unknown>) });
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                新增
              </Button>
            ) : null}
            {canDelete ? (
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer border-destructive text-destructive hover:text-destructive"
                disabled={!selectedIds.length}
                onClick={() => void handleBatchDelete()}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                批量删除
              </Button>
            ) : null}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                {showSelection ? (
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) =>
                        setSelectedIds(
                          checked
                            ? records
                                .filter((record) => typeof record.id === "number")
                                .map((record) => record.id as number)
                            : []
                        )
                      }
                      aria-label="全选当前页"
                    />
                  </TableHead>
                ) : null}
                {columns.map((column) => (
                  <TableHead
                    key={column.title}
                    className={classNames("min-w-0", column.align === "center" && "text-center", column.align === "right" && "text-right")}
                    style={{ width: column.width, maxWidth: column.width }}
                  >
                    {column.title}
                  </TableHead>
                ))}
                {showOperation ? <TableHead className="w-[132px] text-center">操作</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showSelection ? 1 : 0) + (showOperation ? 1 : 0)} className="h-24 text-center text-muted-foreground">
                    加载中...
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (showSelection ? 1 : 0) + (showOperation ? 1 : 0)} className="h-24 text-center text-muted-foreground">
                    暂无数据
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={String(record.id)}>
                    {showSelection ? (
                      <TableCell className="text-center">
                        <Checkbox
                          checked={typeof record.id === "number" ? selectedIds.includes(record.id) : false}
                          onCheckedChange={(checked) => {
                            if (typeof record.id !== "number") {
                              return;
                            }
                            setSelectedIds((current) => (checked ? [...current, record.id as number] : current.filter((id) => id !== record.id)));
                          }}
                          aria-label={`选择 ${record.id}`}
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => {
                      const value = column.dataIndex ? record[column.dataIndex] : undefined;
                      return (
                        <TableCell
                          key={column.title}
                          className={classNames("min-w-0", column.align === "center" && "text-center", column.align === "right" && "text-right")}
                        >
                          <div className="min-w-0 truncate [&>*]:min-w-0" title={typeof value === "string" ? value : undefined}>
                            {column.render ? column.render(value, record) : String(value ?? "-")}
                          </div>
                        </TableCell>
                      );
                    })}
                    {showOperation ? (
                      <TableCell className="w-[132px] text-center">
                        <div className="flex items-center justify-center gap-1">
                          {showDetail ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer text-[#606266] hover:text-primary"
                              onClick={() => setDetailRecord(record)}
                              title={`查看${title}详情`}
                            >
                              <Eye className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          ) : null}
                          {canEdit ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer text-primary hover:text-primary"
                              onClick={() => {
                                setEditingRecord(record);
                                setForm(record as Record<string, unknown>);
                                setIsModalOpen(true);
                              }}
                              title={`编辑${title}`}
                            >
                              <Edit3 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          ) : null}
                          {canDelete ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer text-destructive hover:text-destructive"
                              onClick={() => void handleDelete(record)}
                              title={`删除${title}`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4 text-sm text-muted-foreground">
            <span>共 {total} 条</span>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" size="icon" className="cursor-pointer" onClick={() => void fetchPage(page, pageSize, query)}>
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Select value={String(pageSize)} onValueChange={(value) => void fetchPage(1, Number(value), query)}>
                <SelectTrigger className="w-[110px] cursor-pointer">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size} 条/页
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Pagination className="mx-0 w-auto justify-start">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={classNames("cursor-pointer", page <= 1 && "pointer-events-none opacity-50")}
                      onClick={() => void fetchPage(page - 1, pageSize, query)}
                    />
                  </PaginationItem>
                  {visiblePages.map((item, index) => (
                    <PaginationItem key={item === "ellipsis" ? `ellipsis-${index}` : item}>
                      {item === "ellipsis" ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink isActive={item === page} className="cursor-pointer" onClick={() => void fetchPage(item, pageSize, query)}>
                          {item}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      className={classNames("cursor-pointer", page >= totalPages && "pointer-events-none opacity-50")}
                      onClick={() => void fetchPage(page + 1, pageSize, query)}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-hidden sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="flex max-h-[calc(100dvh-8rem)] min-h-0 flex-col gap-4">
            <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={classNames(
                    "grid min-w-0 gap-2",
                    isWideFormField(field) && "sm:col-span-2",
                    field.type === "hidden" && "hidden",
                    field.hiddenOnEdit && editingRecord && "hidden"
                  )}
                >
                  <Label className="text-sm text-[#606266]">
                    {field.label}
                    {field.required ? <span className="text-destructive"> *</span> : null}
                  </Label>
                  {renderField({
                    field,
                    value: form[field.name],
                    values: form,
                    editing: Boolean(editingRecord),
                    onChange: (value) => setForm((current) => ({ ...current, [field.name]: value }))
                  })}
                </div>
              ))}
            </div>
            <DialogFooter className="shrink-0 border-t bg-background pt-4">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => setIsModalOpen(false)}>
                取消
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={saving}>
                {saving ? "保存中..." : "确定"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(detailRecord)} onOpenChange={(open) => !open && setDetailRecord(null)}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>{title}详情</DialogTitle>
          </DialogHeader>
          {detailRecord ? (
            <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
              {detailFields.map((field) => {
                const value = field.dataIndex ? detailRecord[field.dataIndex] : undefined;
                return (
                  <div key={field.label} className="grid gap-1 rounded-md border bg-muted/20 p-3">
                    <div className="text-xs text-muted-foreground">{field.label}</div>
                    <div className="min-w-0 break-words text-sm text-foreground">
                      {field.render ? field.render(value, detailRecord) : formatDetailValue(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(confirmDeleteRecord)} onOpenChange={(open) => !open && setConfirmDeleteRecord(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>删除后不可恢复，请确认是否删除这条{title}记录。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
              onClick={() => confirmDeleteRecord && void executeDelete(confirmDeleteRecord)}
              disabled={deleting}
            >
              {deleting ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmBatchDelete} onOpenChange={setConfirmBatchDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量删除</AlertDialogTitle>
            <AlertDialogDescription>即将删除选中的 {selectedIds.length} 条{title}记录，删除后不可恢复。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">取消</AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
              onClick={() => void executeBatchDelete()}
              disabled={deleting}
            >
              {deleting ? "删除中..." : "确认删除"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function formatDetailValue(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  if (Array.isArray(value)) {
    return value.length ? value.join("、") : "-";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
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
