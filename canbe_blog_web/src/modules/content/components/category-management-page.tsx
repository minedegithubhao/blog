"use client";

import { FolderKanban } from "lucide-react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../api/category-api";
import type { Category, CategoryPayload } from "../types/category";

const columns: AdminResourceColumn<Category>[] = [
  {
    title: "分类名称",
    dataIndex: "name",
    width: "180px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <FolderKanban className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "Slug", dataIndex: "slug", width: "180px" },
  { title: "排序", dataIndex: "sortOrder", width: "90px", align: "center" },
  {
    title: "状态",
    dataIndex: "status",
    width: "100px",
    align: "center",
    render: (value) => <StatusBadge tone={Number(value) === 1 ? "green" : "red"}>{Number(value) === 1 ? "启用" : "停用"}</StatusBadge>
  },
  { title: "更新时间", dataIndex: "gmtModified", width: "170px", render: (value) => formatDate(value as string | null) }
];

const detailFields = [
  { label: "分类名称", dataIndex: "name" as const },
  { label: "Slug", dataIndex: "slug" as const },
  { label: "描述", dataIndex: "description" as const },
  { label: "排序", dataIndex: "sortOrder" as const },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => (Number(value) === 1 ? "启用" : "停用") },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function CategoryManagementPage() {
  return (
    <AdminResourcePage<Category>
      title="分类管理"
      createPermission="category:create"
      editPermission="category:update"
      deletePermission="category:delete"
      searchFields={[
        { name: "name", label: "分类名称" },
        {
          name: "status",
          label: "状态",
          type: "select",
          options: [
            { label: "启用", value: 1 },
            { label: "停用", value: 0 }
          ]
        }
      ]}
      formFields={[
        { name: "name", label: "分类名称", required: true },
        { name: "slug", label: "Slug", required: true },
        { name: "description", label: "描述", type: "textarea" },
        { name: "sortOrder", label: "排序", type: "number", required: true },
        {
          name: "status",
          label: "状态",
          type: "select",
          required: true,
          options: [
            { label: "启用", value: 1 },
            { label: "停用", value: 0 }
          ]
        }
      ]}
      columns={columns}
      detailFields={detailFields}
      defaultValues={{ sortOrder: 0, status: 1 }}
      loadPage={({ page, pageSize, name, status }) =>
        listCategories({
          page,
          pageSize,
          name: typeof name === "string" ? name.trim() || undefined : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const name = String(form.name ?? "").trim();
        const slug = String(form.slug ?? "").trim();
        const description = String(form.description ?? "").trim();

        if (!name) {
          throw new Error("分类名称不能为空");
        }
        if (!slug) {
          throw new Error("Slug 不能为空");
        }

        const payload: CategoryPayload = {
          name,
          slug,
          description,
          sortOrder: Number(form.sortOrder ?? 0),
          status: Number(form.status ?? 1)
        };

        if (editingRecord) {
          await updateCategory(editingRecord.id, payload);
          return;
        }

        await createCategory(payload);
      }}
      deleteRecord={(record) => deleteCategory(record.id)}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
