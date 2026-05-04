"use client";

import { ShieldCheck, WalletCards } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { listRoleAgentPolicies, listUserAgentQuotas, updateRoleAgentPolicy, updateUserAgentQuota } from "../api/quota-api";
import type { RoleAgentPolicy, UserAgentQuota } from "../types/quota";

const quotaColumns: AdminResourceColumn<UserAgentQuota>[] = [
  {
    title: "用户",
    dataIndex: "username",
    width: "160px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <WalletCards className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "用户ID", dataIndex: "userId", width: "90px", align: "center" },
  { title: "Agent", dataIndex: "agentName", width: "180px" },
  { title: "总额度", dataIndex: "totalQuota", width: "100px", align: "center" },
  { title: "已用次数", dataIndex: "usedQuota", width: "100px", align: "center" },
  { title: "剩余次数", dataIndex: "remainingQuota", width: "100px", align: "center" },
  { title: "更新时间", dataIndex: "gmtModified", width: "170px", render: (value) => formatDate(value as string | null) }
];

const policyColumns: AdminResourceColumn<RoleAgentPolicy>[] = [
  {
    title: "角色编码",
    dataIndex: "roleCode",
    width: "160px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "Agent", dataIndex: "agentName", width: "180px" },
  {
    title: "策略状态",
    dataIndex: "enabled",
    width: "100px",
    align: "center",
    render: (value) => <StatusBadge tone={Number(value) === 1 ? "green" : "red"}>{Number(value) === 1 ? "启用" : "停用"}</StatusBadge>
  },
  { title: "默认额度", dataIndex: "totalQuota", width: "100px", align: "center" },
  { title: "更新时间", dataIndex: "gmtModified", width: "170px", render: (value) => formatDate(value as string | null) }
];

export function QuotaManagementPage() {
  return (
    <Tabs defaultValue="users" className="space-y-4">
      <TabsList>
        <TabsTrigger value="users" className="cursor-pointer">用户额度</TabsTrigger>
        <TabsTrigger value="roles" className="cursor-pointer">角色策略</TabsTrigger>
      </TabsList>
      <TabsContent value="users">
        <AdminResourcePage<UserAgentQuota>
          title="用户额度"
          allowCreate={false}
          editPermission="quota:update"
          searchFields={[
            { name: "userId", label: "用户ID", type: "number" },
            { name: "agentId", label: "AgentID", type: "number" }
          ]}
          formFields={[
            { name: "username", label: "用户", disabledOnEdit: true },
            { name: "agentName", label: "Agent", disabledOnEdit: true },
            { name: "usedQuota", label: "已用次数", type: "number", disabledOnEdit: true },
            { name: "totalQuota", label: "总额度", type: "number", required: true }
          ]}
          columns={quotaColumns}
          loadPage={({ page, pageSize, userId, agentId }) =>
            listUserAgentQuotas({
              page,
              pageSize,
              userId: typeof userId === "number" && userId > 0 ? userId : undefined,
              agentId: typeof agentId === "number" && agentId > 0 ? agentId : undefined
            })
          }
          saveRecord={async (editingRecord, form) => {
            if (!editingRecord) {
              return;
            }
            const totalQuota = Number(form.totalQuota ?? 0);
            if (totalQuota < Number(editingRecord.usedQuota ?? 0)) {
              throw new Error("总额度不能小于已用次数");
            }
            await updateUserAgentQuota(editingRecord.id, { totalQuota });
          }}
        />
      </TabsContent>
      <TabsContent value="roles">
        <AdminResourcePage<RoleAgentPolicy>
          title="角色策略"
          allowCreate={false}
          editPermission="roleAgentPolicy:update"
          searchFields={[
            { name: "roleCode", label: "角色编码" },
            { name: "agentId", label: "AgentID", type: "number" }
          ]}
          formFields={[
            { name: "roleCode", label: "角色编码", disabledOnEdit: true },
            { name: "agentName", label: "Agent", disabledOnEdit: true },
            {
              name: "enabled",
              label: "状态",
              type: "select",
              required: true,
              options: [
                { label: "启用", value: 1 },
                { label: "停用", value: 0 }
              ]
            },
            { name: "totalQuota", label: "默认额度", type: "number", required: true }
          ]}
          columns={policyColumns}
          loadPage={({ page, pageSize, roleCode, agentId }) =>
            listRoleAgentPolicies({
              page,
              pageSize,
              roleCode: typeof roleCode === "string" ? roleCode.trim() || undefined : undefined,
              agentId: typeof agentId === "number" && agentId > 0 ? agentId : undefined
            })
          }
          saveRecord={async (editingRecord, form) => {
            if (!editingRecord) {
              return;
            }
            await updateRoleAgentPolicy(editingRecord.id, {
              enabled: Number(form.enabled ?? 1),
              totalQuota: Number(form.totalQuota ?? 10)
            });
          }}
        />
      </TabsContent>
    </Tabs>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
