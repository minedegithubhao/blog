import { Bot, CheckCircle2, Eye, FileText, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const blogStats = [
  { title: "文章数", value: "42", icon: FileText, color: "#3F3FF3" },
  { title: "用户数", value: "128", icon: Users, color: "#f59e0b" },
  { title: "留言数", value: "256", icon: MessageSquare, color: "#10b981" },
  { title: "总访问量", value: "8642", icon: Eye, color: "#8b5cf6" }
];

const agentStats = [
  { title: "Agent数量", value: "8", icon: Bot, color: "#3F3FF3" },
  { title: "Agent调用次数", value: "1234", icon: CheckCircle2, color: "#10b981" },
  { title: "成功率", value: "98.5%", icon: Eye, color: "#f59e0b" },
  { title: "Token消耗", value: "45678", icon: MessageSquare, color: "#ef4444" }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="mb-4 text-base font-semibold text-[#333]">博客</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {blogStats.map((item) => (
            <Card key={item.title} className="rounded-md py-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-2 text-sm text-[#666]">{item.title}</div>
                    <div className="text-[28px] font-bold" style={{ color: "#3F3FF3" }}>
                      {item.value}
                    </div>
                  </div>
                  <item.icon className="h-8 w-8 opacity-30" style={{ color: item.color }} aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-base font-semibold text-[#333]">Agent</h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {agentStats.map((item) => (
            <Card key={item.title} className="rounded-md py-0">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="mb-2 text-sm text-[#666]">{item.title}</div>
                    <div className="text-[28px] font-bold" style={{ color: "#3F3FF3" }}>
                      {item.value}
                    </div>
                  </div>
                  <item.icon className="h-8 w-8 opacity-30" style={{ color: item.color }} aria-hidden="true" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
