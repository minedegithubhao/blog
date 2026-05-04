"use client";

import { useMemo, useState } from "react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createMenu, deleteMenu, listMenus, updateMenu } from "../api/menu-api";
import type { MenuItem, MenuPayload } from "../types/menu";
import { MenuTreeSelectField } from "./menu-tree-select-field";

const menuTypeText: Record<string, string> = {
  CATALOG: "目录",
  MENU: "菜单",
  BUTTON: "按钮"
};

const columns: AdminResourceColumn<MenuItem>[] = [
  { title: "菜单名称", dataIndex: "title", width: "180px" },
  { title: "标识", dataIndex: "name", width: "150px" },
  {
    title: "类型",
    dataIndex: "type",
    width: "100px",
    align: "center",
    render: (value) => <StatusBadge tone="blue">{menuTypeText[String(value)] || String(value ?? "-")}</StatusBadge>
  },
  { title: "排序", dataIndex: "sortOrder", width: "90px", align: "center" },
  {
    title: "显示",
    dataIndex: "visible",
    width: "90px",
    align: "center",
    render: (value) => <StatusBadge tone={Number(value) === 1 ? "green" : "gray"}>{Number(value) === 1 ? "显示" : "隐藏"}</StatusBadge>
  },
  {
    title: "状态",
    dataIndex: "status",
    width: "90px",
    align: "center",
    render: (value) => <StatusBadge tone={Number(value) === 1 ? "green" : "red"}>{Number(value) === 1 ? "启用" : "停用"}</StatusBadge>
  }
];

const detailFields = [
  { label: "菜单名称", dataIndex: "title" as const },
  { label: "菜单标识", dataIndex: "name" as const },
  { label: "上级菜单ID", dataIndex: "parentId" as const },
  { label: "菜单类型", dataIndex: "type" as const, render: (value: unknown) => menuTypeText[String(value)] || String(value ?? "-") },
  { label: "路由地址", dataIndex: "path" as const },
  { label: "组件路径", dataIndex: "component" as const },
  { label: "图标", dataIndex: "icon" as const },
  { label: "权限标识", dataIndex: "permission" as const },
  { label: "排序", dataIndex: "sortOrder" as const },
  { label: "是否显示", dataIndex: "visible" as const, render: (value: unknown) => (Number(value) === 1 ? "显示" : "隐藏") },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => (Number(value) === 1 ? "启用" : "停用") },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function MenuManagementPage() {
  const [menuTreeRefreshKey, setMenuTreeRefreshKey] = useState(0);
  const formFields = useMemo(
    () => [
      {
        name: "parentId",
        label: "上级菜单",
        required: true,
        render: ({
          value,
          values,
          onChange
        }: {
          value: unknown;
          values: Record<string, unknown>;
          onChange: (value: string | number | undefined) => void;
        }) => (
          <MenuTreeSelectField
            value={Number(value ?? 0)}
            currentMenuId={typeof values.id === "number" ? values.id : undefined}
            refreshKey={menuTreeRefreshKey}
            onChange={(nextValue) => onChange(nextValue)}
          />
        )
      },
      {
        name: "type",
        label: "菜单类型",
        type: "select" as const,
        required: true,
        options: [
          { label: "目录", value: "CATALOG" },
          { label: "菜单", value: "MENU" },
          { label: "按钮", value: "BUTTON" }
        ]
      },
      { name: "name", label: "菜单标识", required: true },
      { name: "title", label: "菜单名称", required: true },
      { name: "path", label: "路由地址" },
      { name: "component", label: "组件路径" },
      { name: "icon", label: "图标" },
      { name: "permission", label: "权限标识" },
      { name: "sortOrder", label: "排序", type: "number" as const, required: true },
      {
        name: "visible",
        label: "是否显示",
        type: "select" as const,
        required: true,
        options: [
          { label: "显示", value: 1 },
          { label: "隐藏", value: 0 }
        ]
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
    [menuTreeRefreshKey]
  );

  return (
    <AdminResourcePage<MenuItem>
      title="菜单管理"
      createPermission="menu:create"
      editPermission="menu:update"
      deletePermission="menu:delete"
      searchFields={[
        { name: "title", label: "菜单名称" },
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
      defaultValues={{ parentId: 0, type: "MENU", sortOrder: 0, visible: 1, status: 1 }}
      loadPage={({ page, pageSize, title, status }) =>
        listMenus({
          page,
          pageSize,
          title: typeof title === "string" ? title.trim() || undefined : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const type = String(form.type ?? "MENU").trim();
        const path = String(form.path ?? "").trim();
        const component = String(form.component ?? "").trim();

        if ((type === "CATALOG" || type === "MENU") && !path) {
          throw new Error("目录和菜单类型必须填写路由地址");
        }
        if (type === "MENU" && !component) {
          throw new Error("菜单类型必须填写组件路径");
        }
        if (type === "BUTTON" && component) {
          throw new Error("按钮类型不能填写组件路径");
        }

        const payload: MenuPayload = {
          parentId: Number(form.parentId ?? 0),
          name: String(form.name ?? "").trim(),
          title: String(form.title ?? "").trim(),
          path,
          component,
          icon: String(form.icon ?? "").trim(),
          type,
          permission: String(form.permission ?? "").trim(),
          sortOrder: Number(form.sortOrder ?? 0),
          visible: Number(form.visible ?? 1),
          status: Number(form.status ?? 1)
        };

        if (editingRecord) {
          await updateMenu(editingRecord.id, payload);
          setMenuTreeRefreshKey((current) => current + 1);
          return;
        }

        await createMenu(payload);
        setMenuTreeRefreshKey((current) => current + 1);
      }}
      deleteRecord={async (record) => {
        await deleteMenu(record.id);
        setMenuTreeRefreshKey((current) => current + 1);
      }}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
