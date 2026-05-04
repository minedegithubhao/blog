"use client";

import { Tag } from "lucide-react";
import { AdminResourcePage, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createTag, deleteTag, listTags, updateTag } from "../api/tag-api";
import type { Tag as TagItem, TagPayload } from "../types/tag";

const columns: AdminResourceColumn<TagItem>[] = [
  {
    title: "标签名称",
    dataIndex: "name",
    width: "180px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "Slug", dataIndex: "slug", width: "180px" },
  { title: "更新时间", dataIndex: "gmtModified", width: "170px", render: (value) => formatDate(value as string | null) }
];

const detailFields = [
  { label: "标签名称", dataIndex: "name" as const },
  { label: "Slug", dataIndex: "slug" as const },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function TagManagementPage() {
  return (
    <AdminResourcePage<TagItem>
      title="标签管理"
      createPermission="tag:create"
      editPermission="tag:update"
      deletePermission="tag:delete"
      searchFields={[{ name: "name", label: "标签名称" }]}
      formFields={[
        { name: "name", label: "标签名称", required: true },
        { name: "slug", label: "Slug", required: true }
      ]}
      columns={columns}
      detailFields={detailFields}
      loadPage={({ page, pageSize, name }) =>
        listTags({
          page,
          pageSize,
          name: typeof name === "string" ? name.trim() || undefined : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const name = String(form.name ?? "").trim();
        const slug = String(form.slug ?? "").trim();

        if (!name) {
          throw new Error("标签名称不能为空");
        }
        if (!slug) {
          throw new Error("Slug 不能为空");
        }

        const payload: TagPayload = { name, slug };

        if (editingRecord) {
          await updateTag(editingRecord.id, payload);
          return;
        }

        await createTag(payload);
      }}
      deleteRecord={(record) => deleteTag(record.id)}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
