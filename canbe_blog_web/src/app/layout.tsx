import type { Metadata } from "next";
import "./globals.css";
import { ChunkLoadRecovery } from "@/components/app/chunk-load-recovery";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Canbe Blog",
  description: "Canbe Blog frontend scaffold"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <ChunkLoadRecovery />
        <Toaster richColors position="top-center" />
        {children}
      </body>
    </html>
  );
}
