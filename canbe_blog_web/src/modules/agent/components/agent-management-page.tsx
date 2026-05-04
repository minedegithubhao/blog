"use client";

import { Bot, Cable, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createAgent, deleteAgent, listAgents, testAgentConnection, updateAgent } from "../api/agent-api";
import type { Agent, AgentPayload } from "../types/agent";

const columns: AdminResourceColumn<Agent>[] = [
  {
    title: "Agent名称",
    dataIndex: "name",
    width: "180px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <Bot className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "编码", dataIndex: "code", width: "150px" },
  {
    title: "提供方",
    dataIndex: "providerType",
    width: "100px",
    render: (value) => <StatusBadge tone={String(value ?? "CUSTOM") === "DIFY" ? "blue" : "gray"}>{String(value ?? "CUSTOM")}</StatusBadge>
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "100px",
    align: "center",
    render: (value) => <StatusBadge tone={Number(value) === 1 ? "green" : "red"}>{Number(value) === 1 ? "启用" : "停用"}</StatusBadge>
  },
  { title: "排序", dataIndex: "sortOrder", width: "80px", align: "center" },
  {
    title: "连接",
    width: "80px",
    align: "center",
    render: (_value, record) => <ConnectionButton record={record} />
  }
];

const detailFields = [
  { label: "Agent名称", dataIndex: "name" as const },
  { label: "编码", dataIndex: "code" as const },
  { label: "提供方", dataIndex: "providerType" as const },
  { label: "Runtime地址", dataIndex: "runtimeUrl" as const },
  { label: "Dify API地址", dataIndex: "apiUrl" as const },
  { label: "API Key", dataIndex: "apiKeyConfigured" as const, render: (value: unknown) => (value ? "已配置" : "未配置") },
  { label: "响应模式", dataIndex: "responseMode" as const },
  { label: "头像地址", dataIndex: "avatarUrl" as const },
  { label: "描述", dataIndex: "description" as const },
  { label: "排序", dataIndex: "sortOrder" as const },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => (Number(value) === 1 ? "启用" : "停用") },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function AgentManagementPage() {
  return (
    <AdminResourcePage<Agent>
      title="Agent管理"
      createPermission="agent:create"
      editPermission="agent:update"
      deletePermission="agent:delete"
      searchFields={[
        { name: "name", label: "Agent名称" },
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
        { name: "name", label: "Agent名称", required: true },
        { name: "code", label: "Agent编码", required: true },
        {
          name: "providerType",
          label: "提供方",
          type: "select",
          required: true,
          options: [
            { label: "CUSTOM", value: "CUSTOM" },
            { label: "DIFY", value: "DIFY" }
          ]
        },
        { name: "runtimeUrl", label: "Runtime地址" },
        { name: "apiUrl", label: "Dify API地址" },
        { name: "apiKey", label: "Dify API Key", type: "password" },
        {
          name: "responseMode",
          label: "响应模式",
          type: "select",
          options: [
            { label: "blocking", value: "blocking" }
          ]
        },
        { name: "avatarUrl", label: "头像地址" },
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
      defaultValues={{ providerType: "CUSTOM", responseMode: "blocking", sortOrder: 0, status: 1 }}
      loadPage={({ page, pageSize, name, status }) =>
        listAgents({
          page,
          pageSize,
          name: typeof name === "string" ? name.trim() || undefined : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const name = String(form.name ?? "").trim();
        const code = String(form.code ?? "").trim().toUpperCase();
        const providerType = String(form.providerType ?? "CUSTOM").trim().toUpperCase();
        const runtimeUrl = String(form.runtimeUrl ?? "").trim();
        const apiUrl = String(form.apiUrl ?? "").trim();
        const apiKey = String(form.apiKey ?? "").trim();
        const responseMode = String(form.responseMode ?? "blocking").trim() || "blocking";

        if (!name) {
          throw new Error("Agent名称不能为空");
        }
        if (!/^[A-Z][A-Z0-9_]*$/.test(code)) {
          throw new Error("Agent编码需以大写字母开头，仅允许大写字母、数字和下划线");
        }
        if (providerType === "CUSTOM" && !runtimeUrl) {
          throw new Error("CUSTOM Agent必须填写Runtime地址");
        }
        if (providerType === "DIFY" && !apiUrl) {
          throw new Error("Dify Agent必须填写API地址");
        }
        if (providerType !== "CUSTOM" && providerType !== "DIFY") {
          throw new Error("Agent提供方仅支持CUSTOM或DIFY");
        }

        const payload: AgentPayload = {
          name,
          code,
          providerType,
          runtimeUrl,
          embedUrl: "",
          apiUrl,
          apiKey,
          responseMode,
          avatarUrl: String(form.avatarUrl ?? "").trim(),
          description: String(form.description ?? "").trim(),
          sortOrder: Number(form.sortOrder ?? 0),
          status: Number(form.status ?? 1)
        };

        if (editingRecord) {
          await updateAgent(editingRecord.id, payload);
          return;
        }
        await createAgent(payload);
      }}
      deleteRecord={(record) => deleteAgent(record.id)}
    />
  );
}

function ConnectionButton({ record }: { record: Agent }) {
  async function handleTest() {
    try {
      const result = await testAgentConnection(record.id);
      if (result.success) {
        toast.success(`连接成功，耗时 ${result.latencyMs ?? 0}ms`);
        return;
      }
      toast.warning(result.errorMessage || "连接失败");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "连接失败");
    }
  }

  return (
    <Button type="button" variant="ghost" size="icon" className="cursor-pointer text-primary hover:text-primary" onClick={() => void handleTest()} title="测试连接">
      {record.status === 1 ? <Cable className="h-4 w-4" aria-hidden="true" /> : <XCircle className="h-4 w-4" aria-hidden="true" />}
      <span className="sr-only">测试连接</span>
    </Button>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
