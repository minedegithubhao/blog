"use client";

import { type FormEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { Save, Settings } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useDashboardAccess } from "@/modules/dashboard/components/dashboard-access-context";
import { getSiteConfig, updateSiteConfig } from "../api/site-config-api";
import type { SiteConfigPayload } from "../types/site-config";

const defaultForm: SiteConfigPayload = {
  siteName: "乘风博客",
  logoUrl: "",
  heroEyebrow: "欢迎来到我的博客",
  heroTitle: "你好，我是",
  heroTitleHighlight: "乘风",
  heroSubtitle: "一名热爱技术的全栈开发者，专注于 Web 开发、用户体验设计和开源项目。在这里分享我的技术心得、学习笔记和项目经验。",
  profileAvatarUrl: "/images/profile/home-avatar.jpg",
  githubUrl: "",
  twitterUrl: "",
  contactUrl: "",
  totalViews: 0,
  projectCount: 0,
  footerYear: "2025",
  footerText: "乘风博客. All rights reserved."
};

export function SiteConfigManagementPage() {
  const { permissions } = useDashboardAccess();
  const permissionSet = useMemo(() => new Set(permissions), [permissions]);
  const canUpdate = permissionSet.has("siteConfig:update");
  const [form, setForm] = useState<SiteConfigPayload>(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const config = await getSiteConfig();
        setForm({
          siteName: config.siteName || defaultForm.siteName,
          logoUrl: config.logoUrl || "",
          heroEyebrow: config.heroEyebrow || "",
          heroTitle: config.heroTitle || defaultForm.heroTitle,
          heroTitleHighlight: config.heroTitleHighlight || "",
          heroSubtitle: config.heroSubtitle || "",
          profileAvatarUrl: config.profileAvatarUrl || "",
          githubUrl: config.githubUrl || "",
          twitterUrl: config.twitterUrl || "",
          contactUrl: config.contactUrl || "",
          totalViews: Number(config.totalViews ?? 0),
          projectCount: Number(config.projectCount ?? 0),
          footerYear: config.footerYear || "",
          footerText: config.footerText || ""
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "加载站点配置失败");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.siteName.trim() || !form.heroTitle.trim()) {
      toast.warning("站点名称和首页标题不能为空");
      return;
    }

    setSaving(true);
    try {
      await updateSiteConfig({
        ...form,
        siteName: form.siteName.trim(),
        logoUrl: form.logoUrl.trim(),
        heroEyebrow: form.heroEyebrow.trim(),
        heroTitle: form.heroTitle.trim(),
        heroTitleHighlight: form.heroTitleHighlight.trim(),
        heroSubtitle: form.heroSubtitle.trim(),
        profileAvatarUrl: form.profileAvatarUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        twitterUrl: form.twitterUrl.trim(),
        contactUrl: form.contactUrl.trim(),
        footerYear: form.footerYear.trim(),
        footerText: form.footerText.trim(),
        totalViews: Math.max(0, Number(form.totalViews || 0)),
        projectCount: Math.max(0, Number(form.projectCount || 0))
      });
      toast.success("站点配置已保存");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存站点配置失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-w-0 max-w-full space-y-4">
      <Card className="min-w-0 rounded-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="h-4 w-4 text-primary" aria-hidden="true" />
            站点配置
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0">
          {loading ? (
            <div className="h-24 text-sm text-muted-foreground">加载中...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              <section className="grid gap-4 md:grid-cols-2">
                <Field label="站点名称" required>
                  <Input value={form.siteName} onChange={(event) => updateField("siteName", event.target.value)} />
                </Field>
                <Field label="Logo 地址">
                  <Input value={form.logoUrl} placeholder="/uploads/..." onChange={(event) => updateField("logoUrl", event.target.value)} />
                </Field>
              </section>

              <section className="grid gap-4 md:grid-cols-2">
                <Field label="首页提示语">
                  <Input value={form.heroEyebrow} onChange={(event) => updateField("heroEyebrow", event.target.value)} />
                </Field>
                <Field label="首页头像地址">
                  <Input value={form.profileAvatarUrl} placeholder="/images/profile/home-avatar.jpg" onChange={(event) => updateField("profileAvatarUrl", event.target.value)} />
                </Field>
                <Field label="首页标题" required>
                  <Input value={form.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} />
                </Field>
                <Field label="首页标题强调文字">
                  <Input value={form.heroTitleHighlight} onChange={(event) => updateField("heroTitleHighlight", event.target.value)} />
                </Field>
                <div className="md:col-span-2">
                  <Field label="首页简介">
                    <Textarea value={form.heroSubtitle} rows={4} onChange={(event) => updateField("heroSubtitle", event.target.value)} />
                  </Field>
                </div>
              </section>

              <section className="grid gap-4 md:grid-cols-3">
                <Field label="GitHub 地址">
                  <Input value={form.githubUrl} placeholder="https://github.com/..." onChange={(event) => updateField("githubUrl", event.target.value)} />
                </Field>
                <Field label="Twitter 地址">
                  <Input value={form.twitterUrl} placeholder="https://twitter.com/..." onChange={(event) => updateField("twitterUrl", event.target.value)} />
                </Field>
                <Field label="联系我地址">
                  <Input value={form.contactUrl} placeholder="mailto:hello@example.com" onChange={(event) => updateField("contactUrl", event.target.value)} />
                </Field>
              </section>

              <section className="grid gap-4 md:grid-cols-4">
                <Field label="总浏览量">
                  <Input type="number" min={0} value={form.totalViews} onChange={(event) => updateField("totalViews", Number(event.target.value || 0))} />
                </Field>
                <Field label="开源项目数">
                  <Input type="number" min={0} value={form.projectCount} onChange={(event) => updateField("projectCount", Number(event.target.value || 0))} />
                </Field>
                <Field label="页脚年份">
                  <Input value={form.footerYear} onChange={(event) => updateField("footerYear", event.target.value)} />
                </Field>
                <Field label="页脚文案">
                  <Input value={form.footerText} onChange={(event) => updateField("footerText", event.target.value)} />
                </Field>
              </section>

              {form.profileAvatarUrl ? (
                <section className="flex min-w-0 flex-wrap items-center gap-4 rounded-md border bg-muted/30 p-4">
                  <div className="h-20 w-20 overflow-hidden rounded-full border bg-white">
                    <img src={form.profileAvatarUrl} alt="首页头像预览" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 text-sm text-muted-foreground">
                    <div className="font-medium text-foreground">首页头像预览</div>
                    <div className="break-all">{form.profileAvatarUrl}</div>
                  </div>
                </section>
              ) : null}

              <div className="flex justify-end">
                <Button type="submit" className="cursor-pointer" disabled={saving || !canUpdate}>
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {saving ? "保存中..." : "保存配置"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );

  function updateField<K extends keyof SiteConfigPayload>(key: K, value: SiteConfigPayload[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <Label className="text-sm text-[#606266]">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {children}
    </div>
  );
}
