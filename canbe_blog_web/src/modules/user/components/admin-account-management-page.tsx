"use client";

import { useEffect, useMemo, useState } from "react";
import { UserCog } from "lucide-react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import {
  createAdminAccount,
  deleteAdminAccount,
  listAdminAccounts,
  updateAdminAccount
} from "../api/admin-account-api";
import { listRoles } from "../api/role-api";
import type { AdminAccount, AdminAccountCreatePayload, AdminAccountUpdatePayload } from "../types/admin-account";
import type { Role } from "../types/role";

const columns: AdminResourceColumn<AdminAccount>[] = [
  {
    title: "用户名",
    dataIndex: "username",
    width: "180px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <UserCog className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "昵称", dataIndex: "nickname", width: "160px" },
  {
    title: "角色",
    dataIndex: "roleCode",
    width: "120px",
    align: "center",
    render: (value) => <StatusBadge tone="blue">{value === "ADMIN" ? "管理员" : "普通用户"}</StatusBadge>
  },
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
  { label: "用户名", dataIndex: "username" as const },
  { label: "昵称", dataIndex: "nickname" as const },
  { label: "邮箱", dataIndex: "email" as const },
  { label: "角色", dataIndex: "roleCode" as const, render: (value: unknown) => (value === "ADMIN" ? "管理员" : "普通用户") },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => (Number(value) === 1 ? "启用" : "停用") },
  { label: "最近登录", dataIndex: "lastLoginAt" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function AdminAccountManagementPage() {
  const [roleOptions, setRoleOptions] = useState<Array<{ label: string; value: string }>>([]);

  useEffect(() => {
    let ignore = false;

    async function loadRoles() {
      try {
        const result = await listRoles({ page: 1, pageSize: 100, status: 1 });
        if (!ignore) {
          setRoleOptions(result.list.map((role: Role) => ({ label: role.name, value: role.code })));
        }
      } catch {
        if (!ignore) {
          setRoleOptions([
            { label: "管理员", value: "ADMIN" },
            { label: "普通用户", value: "USER" }
          ]);
        }
      }
    }

    void loadRoles();
    return () => {
      ignore = true;
    };
  }, []);

  const formFields = useMemo(
    () => [
      { name: "username", label: "用户名", required: true, disabledOnEdit: true },
      { name: "password", label: "初始密码", type: "password" as const, hiddenOnEdit: true },
      { name: "nickname", label: "昵称", required: true },
      { name: "email", label: "邮箱" },
      {
        name: "roleCode",
        label: "角色",
        type: "select" as const,
        required: true,
        options: roleOptions
      },
      {
        name: "status",
        label: "状态",
        type: "select" as const,
        required: true,
        options: [
          { label: "启用", value: 1 },
          { label: "停用", value: 0 }
        ]
      }
    ],
    [roleOptions]
  );

  return (
    <AdminResourcePage<AdminAccount>
      title="用户管理"
      createPermission="adminAccount:create"
      editPermission="adminAccount:update"
      deletePermission="adminAccount:delete"
      searchFields={[
        { name: "username", label: "用户名" },
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
      formFields={formFields}
      columns={columns}
      detailFields={detailFields}
      defaultValues={{ roleCode: "USER", status: 1 }}
      loadPage={({ page, pageSize, username, status }) =>
        listAdminAccounts({
          page,
          pageSize,
          username: typeof username === "string" ? username.trim() || undefined : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const nickname = String(form.nickname ?? "").trim();
        const email = String(form.email ?? "").trim();
        const roleCode = (form.roleCode as "ADMIN" | "USER") ?? "USER";

        if (!nickname) {
          throw new Error("昵称不能为空");
        }
        if (nickname.length > 20) {
          throw new Error("昵称长度不能超过 20 位");
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          throw new Error("邮箱格式不正确");
        }

        if (editingRecord) {
          const payload: AdminAccountUpdatePayload = {
            nickname,
            email: email || null,
            roleCode,
            status: Number(form.status ?? 1)
          };
          await updateAdminAccount(editingRecord.id, payload);
          return;
        }

        const username = String(form.username ?? "").trim();
        const password = String(form.password ?? "");

        if (!username) {
          throw new Error("新增账号时必须填写用户名");
        }
        if (!/^[A-Za-z0-9_]{4,20}$/.test(username)) {
          throw new Error("用户名只允许字母、数字、下划线，长度 4 到 20 位");
        }
        if (!password) {
          throw new Error("新增账号时必须填写初始密码");
        }
        if (password.length < 6) {
          throw new Error("密码长度不能少于 6 位");
        }

        const payload: AdminAccountCreatePayload = {
          username,
          password,
          nickname,
          email: email || null,
          roleCode,
          status: Number(form.status ?? 1)
        };
        await createAdminAccount(payload);
      }}
      deleteRecord={(record) => deleteAdminAccount(record.id)}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
