import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bot,
  Code,
  FileText,
  MessageSquare,
  Sparkles,
  Zap,
  Brain,
  Palette,
  type LucideIcon
} from "lucide-react";
import { listPublicAgents } from "../api/public-article-api";
import type { PublicAgent } from "../types/public-agent";

type AgentCardItem = {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  tags: string[];
  conversations: number;
};

const iconPool = [Code, FileText, Sparkles, Brain, Palette, MessageSquare];
const colorPool = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];

export async function BlogAgentPage() {
  const agents = await safeLoadAgents();
  const items = agents.list.map(toAgentCardItem);

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
            <Link href="/blog/posts" className="text-sm font-medium text-gray-600 hover:text-foreground transition-colors">
              博客
            </Link>
            <Link href="/blog/agent" className="text-sm font-medium text-foreground transition-colors">
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
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full" style={{ color: "#3F3FF3", backgroundColor: "#3F3FF3" + "15" }}>
            <Bot className="w-5 h-5" />
            <span className="text-sm font-medium">AI 智能助手</span>
          </div>
          <h2 className="text-4xl font-bold text-foreground mb-4">
            选择你的 <span style={{ color: "#3F3FF3" }}>Agent</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            多种专业 AI 助手随时为你服务，无论是编程、写作还是创意设计，都能找到适合你的智能伙伴
          </p>
        </div>
      </section>

      {/* Agent Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {items.length ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {items.map((agent) => (
              <Link key={agent.id} href={`/blog/agent/${agent.id}`}>
                <Card className="h-full border-gray-200 hover:shadow-lg transition-all cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl ${agent.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <agent.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground transition-colors cursor-pointer group-hover:text-[#3F3FF3]">
                          {agent.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Zap className="w-3 h-3" />
                          {agent.conversations.toLocaleString()} 次对话
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {agent.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {agent.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="border-gray-200">
            <CardContent className="p-10 text-center text-sm text-muted-foreground">
              暂无可体验的 Agent
            </CardContent>
          </Card>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 乘风博客. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

async function safeLoadAgents() {
  try {
    return await listPublicAgents({ page: 1, pageSize: 50 });
  } catch {
    return { list: [], total: 0, page: 1, pageSize: 50 };
  }
}

function toAgentCardItem(agent: PublicAgent, index: number): AgentCardItem {
  return {
    id: agent.id,
    name: agent.name,
    description: agent.description || "这个 Agent 暂未填写描述",
    icon: iconPool[index % iconPool.length],
    color: colorPool[index % colorPool.length],
    tags: [agent.code],
    conversations: 0
  };
}
