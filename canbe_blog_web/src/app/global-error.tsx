"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-muted/40">
        <main className="flex min-h-screen items-center justify-center p-6">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle className="mt-4">页面加载失败</CardTitle>
              <CardDescription>
                页面资源可能已经更新，或者开发服务器刚刚重新编译。可以先尝试刷新恢复。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center gap-3">
              <Button type="button" variant="outline" className="cursor-pointer" onClick={() => window.location.reload()}>
                <RefreshCcw className="h-4 w-4" aria-hidden="true" />
                刷新页面
              </Button>
              <Button type="button" className="cursor-pointer" onClick={reset}>
                重试
              </Button>
            </CardContent>
          </Card>
        </main>
      </body>
    </html>
  );
}
