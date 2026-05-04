"use client";

import { BookText } from "lucide-react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createDictItem, deleteDictItem, listDictItems, updateDictItem } from "../api/dict-api";
import type { DictItem, DictItemPayload } from "../types/dict-item";

const columns: AdminResourceColumn<DictItem>[] = [
  {
    title: "类型编码",
    dataIndex: "typeCode",
    width: "150px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <BookText className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "类型名称", dataIndex: "typeName", width: "160px" },
  { title: "字典标签", dataIndex: "itemLabel", width: "160px" },
  { title: "字典值", dataIndex: "itemValue", width: "160px" },
  { title: "排序", dataIndex: "sortOrder", width: "90px", align: "center" },
  {
    title: "状态",
    dataIndex: "status",
    width: "90px",
    align: "center",
    render: (value) => <StatusBadge tone={Number(value) === 1 ? "green" : "red"}>{Number(value) === 1 ? "启用" : "停用"}</StatusBadge>
  },
  { title: "更新时间", dataIndex: "gmtModified", width: "170px", render: (value) => formatDate(value as string | null) }
];

const detailFields = [
  { label: "类型编码", dataIndex: "typeCode" as const },
  { label: "类型名称", dataIndex: "typeName" as const },
  { label: "字典标签", dataIndex: "itemLabel" as const },
  { label: "字典值", dataIndex: "itemValue" as const },
  { label: "排序", dataIndex: "sortOrder" as const },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => (Number(value) === 1 ? "启用" : "停用") },
  { label: "备注", dataIndex: "remark" as const },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function DictManagementPage() {
  return (
    <AdminResourcePage<DictItem>
      title="字典管理"
      createPermission="dict:create"
      editPermission="dict:update"
      deletePermission="dict:delete"
      searchFields={[
        { name: "typeCode", label: "类型编码" },
        { name: "itemLabel", label: "字典标签" },
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
        { name: "typeCode", label: "类型编码", required: true },
        { name: "typeName", label: "类型名称", required: true },
        { name: "itemLabel", label: "字典标签", required: true },
        { name: "itemValue", label: "字典值", required: true },
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
        },
        { name: "remark", label: "备注", type: "textarea" }
      ]}
      columns={columns}
      detailFields={detailFields}
      defaultValues={{ sortOrder: 0, status: 1 }}
      loadPage={({ page, pageSize, typeCode, itemLabel, status }) =>
        listDictItems({
          page,
          pageSize,
          typeCode: typeof typeCode === "string" ? typeCode.trim() || undefined : undefined,
          itemLabel: typeof itemLabel === "string" ? itemLabel.trim() || undefined : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const typeCode = String(form.typeCode ?? "").trim();
        const typeName = String(form.typeName ?? "").trim();
        const itemLabel = String(form.itemLabel ?? "").trim();
        const itemValue = String(form.itemValue ?? "").trim();
        const remark = String(form.remark ?? "").trim();

        if (!typeCode || !typeName || !itemLabel || !itemValue) {
          throw new Error("字典类型和字典项字段不能为空");
        }

        const payload: DictItemPayload = {
          typeCode,
          typeName,
          itemLabel,
          itemValue,
          sortOrder: Number(form.sortOrder ?? 0),
          status: Number(form.status ?? 1),
          remark
        };

        if (editingRecord) {
          await updateDictItem(editingRecord.id, payload);
          return;
        }

        await createDictItem(payload);
      }}
      deleteRecord={(record) => deleteDictItem(record.id)}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
