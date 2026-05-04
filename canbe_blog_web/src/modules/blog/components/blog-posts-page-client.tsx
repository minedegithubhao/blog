"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Tag,
  FolderTree
} from "lucide-react";

export type BlogPostListItem = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  tags: string[];
  category: string;
  cover: string;
};

type CountItem = {
  name: string;
  count: number;
};

export function BlogPostsPageClient({ posts, total }: { posts: BlogPostListItem[]; total: number }) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => buildCategoryCounts(posts), [posts]);
  const tags = useMemo(() => buildTagCounts(posts), [posts]);
  const totalViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);

  const filteredPosts = posts.filter((post) => {
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    return matchesTag && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold text-foreground">乘风博客</h1>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors">
              首页
            </Link>
            <Link href="/blog/posts" className="text-sm font-medium text-foreground transition-colors">
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

      {/* Page Title */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <h2 className="text-3xl font-bold text-foreground mb-2">博客文章</h2>
          <p className="text-muted-foreground">浏览所有技术文章，按分类或标签筛选</p>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Category Tabs - Full Width */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSelectedTag(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
              !selectedCategory && !selectedTag
                ? "text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
            style={!selectedCategory && !selectedTag ? { backgroundColor: "#3F3FF3" } : {}}
          >
            全部文章
          </button>
          {categories.slice(0, 4).map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name === selectedCategory ? null : category.name);
                setSelectedTag(null);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                category.name === selectedCategory
                  ? "text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
              style={category.name === selectedCategory ? { backgroundColor: "#3F3FF3" } : {}}
            >
              {category.name}
            </button>
          ))}
          {selectedTag && (
            <span className="px-4 py-2 text-sm font-medium rounded-lg bg-green-600 text-white flex items-center gap-2">
              标签: {selectedTag}
              <button
                onClick={() => setSelectedTag(null)}
                className="hover:bg-green-700 rounded-full p-0.5 cursor-pointer"
              >
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                  <path d="M9 3L3 9M3 3L9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </span>
          )}
        </div>

        <div className="flex gap-8">
          {/* Posts */}
          <div className="flex-1">
            <div className="space-y-8">
              {filteredPosts.map((post) => (
                <Link key={post.id} href={`/blog/posts/${post.id}`}>
                  <Card className="group mb-2 cursor-pointer overflow-hidden border-gray-200 transition-shadow hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row">
                      <div className="h-48 w-full flex-shrink-0 overflow-hidden bg-gray-100 sm:h-36 sm:w-48">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="flex-1 p-5">
                        <h4 className="text-lg font-semibold text-foreground mb-2 transition-colors cursor-pointer" onMouseEnter={(event) => (event.currentTarget.style.color = "#3F3FF3")} onMouseLeave={(event) => (event.currentTarget.style.color = "")}>
                          {post.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 overflow-hidden">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {post.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.comments}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setSelectedTag(tag);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors"
                            >
                              <Tag className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">没有找到符合条件的文章</p>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedTag(null);
                    setSelectedCategory(null);
                  }}
                  className="mt-4 cursor-pointer"
                >
                  清除筛选条件
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0">
            {/* Categories */}
            <Card className="border-gray-200 mb-6">
              <CardContent className="p-5">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FolderTree className="w-4 h-4" />
                  文章分类
                </h4>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name === selectedCategory ? null : category.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                        category.name === selectedCategory
                          ? "text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                      style={category.name === selectedCategory ? { backgroundColor: "#3F3FF3" } : {}}
                    >
                      <span>{category.name}</span>
                      <span className={`text-xs ${category.name === selectedCategory ? "text-blue-200" : "text-gray-400"}`}>
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-gray-200 mb-6">
              <CardContent className="p-5">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  热门标签
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() => setSelectedTag(tag.name === selectedTag ? null : tag.name)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-full transition-colors cursor-pointer ${
                        tag.name === selectedTag
                          ? "text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      style={tag.name === selectedTag ? { backgroundColor: "#3F3FF3" } : {}}
                    >
                      {tag.name}
                      <span className="text-xs opacity-70">({tag.count})</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="border-gray-200">
              <CardContent className="p-5">
                <h4 className="text-sm font-semibold text-foreground mb-4">博客统计</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">文章数量</span>
                    <span className="font-medium text-foreground">{total} 篇</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">总浏览量</span>
                    <span className="font-medium text-foreground">{totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">获得点赞</span>
                    <span className="font-medium text-foreground">{totalLikes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">评论数量</span>
                    <span className="font-medium text-foreground">{totalComments.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 乘风博客. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function buildCategoryCounts(posts: BlogPostListItem[]): CountItem[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

function buildTagCounts(posts: BlogPostListItem[]): CountItem[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}
