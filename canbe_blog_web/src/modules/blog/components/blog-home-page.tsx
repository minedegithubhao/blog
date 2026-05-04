import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Calendar,
  Eye,
  BookOpen,
  Code,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { listPublicArticles } from "../api/public-article-api";
import type { PublicArticle } from "../types/public-article";
import { getSiteConfig } from "@/modules/system/api/site-config-api";
import type { SiteConfig } from "@/modules/system/types/site-config";

const defaultSiteConfig: SiteConfig = {
  id: 1,
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
  footerText: "乘风博客. All rights reserved.",
  gmtCreate: null,
  gmtModified: null
};

export async function BlogHomePage() {
  const [articles, siteConfig] = await Promise.all([safeLoadArticles(1, 3), safeLoadSiteConfig()]);
  const featuredPosts = articles.list.map(toFeaturedPost);
  const stats = [
    { label: "文章数量", value: String(articles.total), icon: BookOpen },
    { label: "总浏览量", value: formatCount(siteConfig.totalViews), icon: Eye },
    { label: "开源项目", value: formatCount(siteConfig.projectCount), icon: Code }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {siteConfig.logoUrl ? <img src={siteConfig.logoUrl} alt={siteConfig.siteName} className="h-8 w-8 rounded object-cover" /> : null}
            <h1 className="text-xl font-semibold text-foreground">{siteConfig.siteName}</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-foreground transition-colors">
              首页
            </Link>
            <Link href="/blog/posts" className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors">
              博客
            </Link>
            <Link href="/blog/agent" className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors">
              Agent
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors">
              关于
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors">
              后台管理
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-16">
            {/* Left: Profile */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4" style={{ color: "#3F3FF3" }}>
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-medium">{siteConfig.heroEyebrow}</span>
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                {siteConfig.heroTitle}
                {siteConfig.heroTitleHighlight ? <span style={{ color: "#3F3FF3" }}>{siteConfig.heroTitleHighlight}</span> : null}
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {siteConfig.heroSubtitle}
              </p>
              <div className="flex items-center gap-4 mb-8">
                <SocialButton href={siteConfig.githubUrl} label="GitHub" icon={<Github className="w-4 h-4" />} />
                <SocialButton href={siteConfig.twitterUrl} label="Twitter" icon={<Twitter className="w-4 h-4" />} />
                <SocialButton href={siteConfig.contactUrl} label="联系我" icon={<Mail className="w-4 h-4" />} />
              </div>
              {/* Stats */}
              <div className="flex items-center gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <stat.icon className="w-5 h-5" style={{ color: "#3F3FF3" }} />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: Avatar */}
            <div className="flex-shrink-0">
              <div className="h-64 w-64 overflow-hidden rounded-full border-4 border-white bg-blue-50 shadow-lg">
                <img
                  src={siteConfig.profileAvatarUrl || defaultSiteConfig.profileAvatarUrl}
                  alt="乘风博客头像"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-2">精选文章</h3>
            <p className="text-muted-foreground">探索最新的技术文章和教程</p>
          </div>
          <Link href="/blog/posts">
            <Button variant="outline" className="gap-2 cursor-pointer">
              查看全部
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {featuredPosts.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/blog/posts/${post.id}`}>
                <Card className="overflow-hidden border-gray-200 hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={post.cover}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h4 className="text-lg font-semibold text-foreground mb-2 transition-colors line-clamp-2 group-hover:transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {post.views}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              暂无已发布文章
            </CardContent>
          </Card>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">想要了解更多?</h3>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            浏览我的博客文章，探索前端开发、后端技术、AI 应用等多个领域的技术分享
          </p>
          <Link href="/blog/posts">
            <Button className="gap-2 cursor-pointer" style={{ backgroundColor: "#3F3FF3" }}>
              浏览全部文章
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {siteConfig.footerYear} {siteConfig.footerText}
          </p>
        </div>
      </footer>
    </div>
  );
}

async function safeLoadSiteConfig() {
  try {
    return await getSiteConfig();
  } catch {
    return defaultSiteConfig;
  }
}

async function safeLoadArticles(page: number, pageSize: number) {
  try {
    return await listPublicArticles({ page, pageSize });
  } catch {
    return { list: [], total: 0, page, pageSize };
  }
}

function toFeaturedPost(article: PublicArticle, index: number) {
  const fallbackCovers = ["/images/defaults/article-cover.png", "/images/defaults/article-cover.png", "/images/defaults/article-cover.png"];
  return {
    id: article.id,
    title: article.title,
    excerpt: article.summary || article.content,
    date: formatDate(article.gmtModified || article.gmtCreate),
    views: 0,
    cover: article.coverUrl || fallbackCovers[index % fallbackCovers.length]
  };
}

function SocialButton({ href, label, icon }: { href: string; label: string; icon: ReactNode }) {
  if (!href) {
    return (
      <Button variant="outline" size="sm" className="gap-2 cursor-pointer" disabled>
        {icon}
        {label}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm" className="gap-2 cursor-pointer">
      <Link href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
        {icon}
        {label}
      </Link>
    </Button>
  );
}

function formatCount(value: number) {
  return Number(value || 0).toLocaleString();
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }
  return value.replace("T", " ").slice(0, 10);
}
