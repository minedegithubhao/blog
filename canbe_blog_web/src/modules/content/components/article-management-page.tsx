"use client";

import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { AdminResourcePage, StatusBadge, type AdminResourceColumn } from "@/modules/dashboard/components/admin-resource-page";
import { createArticle, deleteArticle, listArticles, updateArticle } from "../api/article-api";
import { listCategories } from "../api/category-api";
import { listTags } from "../api/tag-api";
import type { Article, ArticlePayload } from "../types/article";
import type { Category } from "../types/category";
import type { Tag } from "../types/tag";
import { TagMultiSelectField } from "./tag-multi-select-field";

const articleStatusOptions = [
  { label: "草稿", value: 0 },
  { label: "发布", value: 1 },
  { label: "下架", value: 2 }
];

const articleStatusText: Record<number, string> = {
  0: "草稿",
  1: "发布",
  2: "下架"
};

const columns: AdminResourceColumn<Article>[] = [
  {
    title: "文章标题",
    dataIndex: "title",
    width: "220px",
    render: (value) => (
      <div className="flex items-center gap-2">
        <FileText className="h-4 w-4 text-[#3F3FF3]" aria-hidden="true" />
        <span className="font-semibold text-gray-950">{String(value ?? "-")}</span>
      </div>
    )
  },
  { title: "分类", dataIndex: "categoryName", width: "140px" },
  {
    title: "状态",
    dataIndex: "status",
    width: "100px",
    align: "center",
    render: (value) => {
      const status = Number(value);
      const tone = status === 1 ? "green" : status === 2 ? "red" : "yellow";
      return <StatusBadge tone={tone}>{articleStatusText[status] || "未知"}</StatusBadge>;
    }
  },
  { title: "更新时间", dataIndex: "gmtModified", width: "170px", render: (value) => formatDate(value as string | null) }
];

const detailFields = [
  { label: "文章标题", dataIndex: "title" as const },
  { label: "分类", dataIndex: "categoryName" as const },
  {
    label: "标签",
    dataIndex: "tagNames" as const,
    render: (value: unknown) => {
      const tags = Array.isArray(value) ? (value as string[]) : [];
      return tags.length ? tags.join("、") : "-";
    }
  },
  { label: "摘要", dataIndex: "summary" as const },
  { label: "封面地址", dataIndex: "coverUrl" as const },
  { label: "正文内容", dataIndex: "content" as const },
  { label: "状态", dataIndex: "status" as const, render: (value: unknown) => articleStatusText[Number(value)] || "未知" },
  { label: "创建时间", dataIndex: "gmtCreate" as const, render: (value: unknown) => formatDate(value as string | null) },
  { label: "更新时间", dataIndex: "gmtModified" as const, render: (value: unknown) => formatDate(value as string | null) }
];

export function ArticleManagementPage() {
  const [categoryOptions, setCategoryOptions] = useState<Array<{ label: string; value: number }>>([]);
  const [tagOptions, setTagOptions] = useState<Array<{ label: string; value: number }>>([]);

  useEffect(() => {
    let ignore = false;

    async function loadOptions() {
      try {
        const [categoryResult, tagResult] = await Promise.all([
          listCategories({ page: 1, pageSize: 100, status: 1 }),
          listTags({ page: 1, pageSize: 100 })
        ]);
        if (!ignore) {
          setCategoryOptions(categoryResult.list.map((item: Category) => ({ label: item.name, value: item.id })));
          setTagOptions(tagResult.list.map((item: Tag) => ({ label: item.name, value: item.id })));
        }
      } catch {
        if (!ignore) {
          setCategoryOptions([]);
          setTagOptions([]);
        }
      }
    }

    void loadOptions();
    return () => {
      ignore = true;
    };
  }, []);

  const formFields = useMemo(
    () => [
      { name: "title", label: "文章标题", required: true },
      { name: "summary", label: "摘要", type: "textarea" as const },
      { name: "content", label: "正文内容", type: "textarea" as const, required: true },
      { name: "coverUrl", label: "封面地址" },
      {
        name: "categoryId",
        label: "分类",
        type: "select" as const,
        required: true,
        options: categoryOptions
      },
      {
        name: "tagIds",
        label: "标签",
        required: true,
        render: ({
          value,
          onChange
        }: {
          value: unknown;
          onChange: (value: number[]) => void;
        }) => <TagMultiSelectField value={Array.isArray(value) ? (value as number[]) : []} options={tagOptions} onChange={onChange} />
      },
      {
        name: "status",
        label: "状态",
        type: "select" as const,
        required: true,
        options: articleStatusOptions
      }
    ],
    [categoryOptions, tagOptions]
  );

  return (
    <AdminResourcePage<Article>
      title="文章管理"
      createPermission="article:create"
      editPermission="article:update"
      deletePermission="article:delete"
      searchFields={[
        { name: "title", label: "文章标题" },
        {
          name: "categoryId",
          label: "分类",
          type: "select",
          options: categoryOptions
        },
        {
          name: "status",
          label: "状态",
          type: "select",
          options: articleStatusOptions
        }
      ]}
      formFields={formFields}
      columns={columns}
      detailFields={detailFields}
      defaultValues={{ status: 0, tagIds: [] }}
      loadPage={({ page, pageSize, title, categoryId, status }) =>
        listArticles({
          page,
          pageSize,
          title: typeof title === "string" ? title.trim() || undefined : undefined,
          categoryId: typeof categoryId === "number" ? categoryId : undefined,
          status: typeof status === "number" ? status : undefined
        })
      }
      saveRecord={async (editingRecord, form) => {
        const title = String(form.title ?? "").trim();
        const summary = String(form.summary ?? "").trim();
        const content = String(form.content ?? "").trim();
        const coverUrl = String(form.coverUrl ?? "").trim();
        const tagIds = Array.isArray(form.tagIds) ? (form.tagIds as number[]) : [];

        if (!title) {
          throw new Error("文章标题不能为空");
        }
        if (!content) {
          throw new Error("正文内容不能为空");
        }
        if (!Number(form.categoryId ?? 0)) {
          throw new Error("请选择分类");
        }
        if (!tagIds.length) {
          throw new Error("至少选择一个标签");
        }

        const payload: ArticlePayload = {
          title,
          summary,
          content,
          coverUrl,
          categoryId: Number(form.categoryId ?? 0),
          tagIds,
          status: Number(form.status ?? 0)
        };

        if (editingRecord) {
          await updateArticle(editingRecord.id, payload);
          return;
        }

        await createArticle(payload);
      }}
      deleteRecord={(record) => deleteArticle(record.id)}
    />
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 16);
}
