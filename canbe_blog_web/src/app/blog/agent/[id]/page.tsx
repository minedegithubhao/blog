import { notFound } from "next/navigation";
import { BlogAgentChatPage } from "@/modules/blog/components/blog-agent-chat-page";
import { listPublicAgents } from "@/modules/blog/api/public-article-api";

export const dynamic = "force-dynamic";

type AgentDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = await params;
  const agentId = Number(id);
  if (!Number.isFinite(agentId)) {
    notFound();
  }

  const agents = await listPublicAgents({ page: 1, pageSize: 100 });
  const agentIndex = agents.list.findIndex((item) => item.id === agentId);
  if (agentIndex < 0) {
    notFound();
  }

  return <BlogAgentChatPage agent={agents.list[agentIndex]} agentIndex={agentIndex} />;
}
