"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clearLoginSession, getAuthToken } from "@/modules/auth/utils/auth-storage";
import {
  ArrowLeft,
  Bot,
  Brain,
  Code,
  ExternalLink,
  FileText,
  MessageSquare,
  Palette,
  RotateCcw,
  Send,
  Sparkles,
  User,
  type LucideIcon
} from "lucide-react";
import { chatWithAgent } from "../api/public-article-api";
import type { AgentChatResponse, PublicAgent } from "../types/public-agent";
import { MarkdownMessage } from "./markdown-message";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  sources?: AgentChatResponse["sources"];
  suggestedQuestions?: string[];
};

const iconPool = [Code, FileText, Sparkles, Brain, Palette, MessageSquare];
const colorPool = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500", "bg-pink-500", "bg-teal-500"];

type BlogAgentChatPageProps = {
  agent: PublicAgent;
  agentIndex: number;
};

export function BlogAgentChatPage({ agent, agentIndex }: BlogAgentChatPageProps) {
  return <BlogAgentConversationPage agent={agent} agentIndex={agentIndex} />;
}

function BlogAgentConversationPage({ agent, agentIndex }: BlogAgentChatPageProps) {
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useMemo(() => `agent_${agent.id}_${Date.now()}`, [agent.id]);
  const agentIcon = iconPool[agentIndex % iconPool.length] || Bot;
  const agentColor = colorPool[agentIndex % colorPool.length] || "bg-blue-500";
  const greeting = `你好！我是${agent.name}，${agent.description || "可以为你提供智能问答服务"}。有什么问题需要我帮忙吗？`;

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "assistant", content: greeting }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSources, setExpandedSources] = useState<Record<number, boolean>>({});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (content?: string) => {
    const query = (content ?? input).trim();
    if (!query || isLoading) {
      return;
    }
    if (!getAuthToken()) {
      toast.warning("请先登录后体验 Agent");
      router.push(`/login?redirect=${encodeURIComponent(`/blog/agent/${agent.id}`)}`);
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: query
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatWithAgent(agent.id, {
        query,
        sessionId,
        topK: 5
      });
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: response.answer || "Agent 暂未返回内容",
          sources: response.sources,
          suggestedQuestions: response.suggestedQuestions
        }
      ]);
    } catch (error) {
      const typedError = error as Error & { code?: number };
      if (typedError.code === 2003 || typedError.code === 2004 || typedError.code === 401) {
        clearLoginSession();
        toast.warning("登录状态已失效，请重新登录");
        router.push(`/login?redirect=${encodeURIComponent(`/blog/agent/${agent.id}`)}`);
        return;
      }
      toast.error(typedError.message || "Agent 调用失败");
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: typedError.message || "Agent 调用失败，请稍后重试。"
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleReset = () => {
    setMessages([{ id: 1, role: "assistant", content: greeting }]);
    setInput("");
    setExpandedSources({});
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/blog/agent">
              <Button variant="ghost" size="sm" className="gap-2 cursor-pointer">
                <ArrowLeft className="w-4 h-4" />
                返回
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${agentColor} flex items-center justify-center`}>
                <AgentIcon icon={agentIcon} className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-foreground">{agent.name}</h1>
                <p className="text-xs text-muted-foreground">{agent.description}</p>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 cursor-pointer">
            <RotateCcw className="w-4 h-4" />
            重新开始
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  message.role === "assistant" ? agentColor : "bg-gray-200"
                }`}>
                  {message.role === "assistant" ? (
                    <AgentIcon icon={agentIcon} className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className={`flex-1 max-w-2xl ${message.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block max-w-full px-4 py-3 rounded-2xl text-sm ${
                      message.role === "assistant"
                        ? "bg-white border border-gray-200 text-foreground text-left"
                        : "text-white whitespace-pre-wrap break-words"
                    }`}
                    style={message.role === "user" ? { backgroundColor: "#3F3FF3" } : {}}
                  >
                    {message.role === "assistant" ? (
                      <MarkdownMessage content={message.content} />
                    ) : (
                      message.content
                    )}
                  </div>
                  {message.role === "assistant" && message.sources?.length ? (
                    <SourceList
                      messageId={message.id}
                      sources={message.sources}
                      expanded={Boolean(expandedSources[message.id])}
                      onToggle={() =>
                        setExpandedSources((prev) => ({
                          ...prev,
                          [message.id]: !prev[message.id]
                        }))
                      }
                    />
                  ) : null}
                  {message.role === "assistant" && message.suggestedQuestions?.length ? (
                    <SuggestedQuestionList
                      questions={message.suggestedQuestions}
                      disabled={isLoading}
                      onSelect={handleSend}
                    />
                  ) : null}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className={`w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center ${agentColor}`}>
                  <AgentIcon icon={agentIcon} className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="inline-block px-4 py-3 rounded-2xl bg-white border border-gray-200">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={`向 ${agent.name} 发送消息...`}
              className="flex-1 h-12 px-4 rounded-xl border-gray-200"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="h-12 w-12 rounded-xl cursor-pointer"
              style={{ backgroundColor: "#3F3FF3" }}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-3">
            按 Enter 发送消息，Shift + Enter 换行
          </p>
        </div>
      </div>
    </div>
  );
}

function AgentIcon({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return <Icon className={className} />;
}

function SuggestedQuestionList({
  questions,
  disabled,
  onSelect
}: {
  questions: string[];
  disabled: boolean;
  onSelect: (question: string) => void;
}) {
  const visibleQuestions = questions.filter(Boolean).slice(0, 4);
  if (!visibleQuestions.length) {
    return null;
  }

  return (
    <div className="mt-2 w-full max-w-full text-left">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="h-px w-4 bg-border" />
        <span>你可以试试</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleQuestions.map((question) => (
          <Button
            key={question}
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled}
            onClick={() => onSelect(question)}
            className="h-8 rounded-full px-3 text-xs font-normal cursor-pointer"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
}

function SourceList({
  messageId,
  sources,
  expanded,
  onToggle
}: {
  messageId: number;
  sources: NonNullable<AgentChatResponse["sources"]>;
  expanded: boolean;
  onToggle: () => void;
}) {
  const visibleSources = expanded ? sources : sources.slice(0, 3);
  const hiddenCount = Math.max(sources.length - 3, 0);

  return (
    <div className="mt-2 w-full max-w-full text-left">
      <div className="mb-1.5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="h-px w-4 bg-border" />
        <span>参考来源</span>
      </div>
      <div className="space-y-1.5">
        {visibleSources.map((source, index) => {
          const key = `${messageId}-${source.id || source.title || index}`;
          const title = source.title || "参考来源";
          const content = (
            <>
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-medium text-muted-foreground">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                {title}
              </div>
              {source.sourceUrl ? <ExternalLink className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" /> : null}
            </>
          );

          if (source.sourceUrl) {
            return (
              <a
                key={key}
                href={source.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex w-full max-w-full items-center gap-3 rounded-lg border border-gray-200 bg-white/80 px-3 py-2 text-left transition-colors hover:border-[#3F3FF3] hover:bg-white cursor-pointer"
              >
                {content}
              </a>
            );
          }

          return (
            <div
              key={key}
              className="flex w-full max-w-full items-center gap-3 rounded-lg border border-gray-200 bg-white/70 px-3 py-2 text-left"
            >
              {content}
            </div>
          );
        })}
      </div>
      {hiddenCount > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="mt-1.5 h-7 px-2 text-xs text-muted-foreground hover:text-[#3F3FF3] cursor-pointer"
        >
          {expanded ? "收起来源" : `查看更多来源（${hiddenCount}）`}
        </Button>
      ) : null}
    </div>
  );
}
