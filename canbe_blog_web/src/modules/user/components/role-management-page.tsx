"use client";

import { ShieldCheck } from "lucide-react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createRole, deleteRole, listRoles, updateRole } from "../api/role-api";
import type { Role, RoleCreatePayload, RoleUpdatePayload } from "../types/role";

const columns: AdminResourceColumn<Role>[] = [
  {
    title: "角色名称",
    dataIndex: "name",
    width: "180px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "角色编码", dataIndex: "code", width: "160px" },
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
  { label: "角色名称", dataIndex: "name" as const },
  { label: "角色编码", dataIndex: "code" as const },
  { label: "角色描述", dataIndex: "description" as const },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => (Number(value) === 1 ? "启用" : "停用") },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function RoleManagementPage() {
  return (
    <AdminResourcePage<Role>
      title="角色管理"
      createPermission="role:create"
      editPermission="role:update"
      deletePermission="role:delete"
      searchFields={[
        { name: "name", label: "角色名称" },
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
        { name: "name", label: "角色名称", required: true },
        { name: "code", label: "角色编码", required: true },
        { name: "description", label: "角色描述", type: "textarea" },
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
      defaultValues={{ status: 1 }}
      loadPage={({ page, pageSize, name, status }) =>
        listRoles({
          page,
          pageSize,
          name: typeof name === "string" ? name.trim() || undefined : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const name = String(form.name ?? "").trim();
        const code = String(form.code ?? "").trim().toUpperCase();
        const description = String(form.description ?? "").trim();

        if (!name) {
          throw new Error("角色名称不能为空");
        }
        if (!code) {
          throw new Error("角色编码不能为空");
        }
        if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
          throw new Error("角色编码只允许大写字母、数字、下划线，且必须以大写字母开头");
        }

        const payload: RoleCreatePayload | RoleUpdatePayload = {
          name,
          code,
          description,
          status: Number(form.status ?? 1)
        };

        if (editingRecord) {
          await updateRole(editingRecord.id, payload);
          return;
        }

        await createRole(payload);
      }}
      deleteRecord={(record) => deleteRole(record.id)}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
