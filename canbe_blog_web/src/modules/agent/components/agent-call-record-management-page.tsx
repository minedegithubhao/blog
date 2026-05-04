"use client";

import { ScrollText } from "lucide-react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { listAgentCallRecords } from "../api/agent-api";
import type { AgentCallRecord } from "../types/agent-call-record";

const columns: AdminResourceColumn<AgentCallRecord>[] = [
  {
    title: "调用用户",
    dataIndex: "username",
    width: "150px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <ScrollText className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "Agent", dataIndex: "agentName", width: "160px" },
  {
    title: "状态",
    dataIndex: "status",
    width: "110px",
    align: "center",
    render: (value) => <StatusBadge tone={statusTone(String(value ?? ""))}>{statusLabel(String(value ?? ""))}</StatusBadge>
  },
  { title: "耗时", dataIndex: "durationMs", width: "100px", align: "center", render: (value) => `${Number(value ?? 0)}ms` },
  { title: "调用时间", dataIndex: "gmtCreate", width: "170px", render: (value) => formatDate(value as string | null) }
];

const detailFields = [
  { label: "调用用户", dataIndex: "username" as const },
  { label: "用户ID", dataIndex: "userId" as const },
  { label: "Agent", dataIndex: "agentName" as const },
  { label: "Agent ID", dataIndex: "agentId" as const },
  { label: "输入内容", dataIndex: "prompt" as const },
  { label: "响应内容", dataIndex: "responseText" as const },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => statusLabel(String(value ?? "")) },
  { label: "错误码", dataIndex: "errorCode" as const },
  { label: "错误信息", dataIndex: "errorMessage" as const },
  { label: "耗时", dataIndex: "durationMs" as const, render: (value: unknown) => `${Number(value ?? 0)}ms` },
  { label: "调用时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function AgentCallRecordManagementPage() {
  return (
    <AdminResourcePage<AgentCallRecord>
      title="Agent调用记录"
      allowCreate={false}
      allowEdit={false}
      searchFields={[
        { name: "userId", label: "用户ID", type: "number" },
        { name: "agentId", label: "AgentID", type: "number" },
        {
          name: "status",
          label: "状态",
          type: "select",
          options: [
            { label: "成功", value: "SUCCESS" },
            { label: "失败", value: "FAILED" },
            { label: "超时", value: "TIMEOUT" },
            { label: "已中断", value: "INTERRUPTED" }
          ]
        }
      ]}
      formFields={[]}
      columns={columns}
      detailFields={detailFields}
      loadPage={({ page, pageSize, userId, agentId, status }) =>
        listAgentCallRecords({
          page,
          pageSize,
          userId: typeof userId === "number" && userId > 0 ? userId : undefined,
          agentId: typeof agentId === "number" && agentId > 0 ? agentId : undefined,
          status: typeof status === "string" ? status : undefined
        })
      }
      saveRecord={async () => undefined}
    />
  );
}

function statusTone(status: string) {
  if (status === "SUCCESS") {
    return "green";
  }
  if (status === "INTERRUPTED" || status === "TIMEOUT") {
    return "yellow";
  }
  if (status === "FAILED") {
    return "red";
  }
  return "gray";
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    SUCCESS: "成功",
    FAILED: "失败",
    TIMEOUT: "超时",
    INTERRUPTED: "已中断"
  };
  return labels[status] ?? (status || "-");
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
