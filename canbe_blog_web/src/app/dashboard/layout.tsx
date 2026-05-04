import type { ReactNode } from "react";
import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { DashboardShell } from "@/modules/dashboard/components/dashboard-shell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard requiredRole="ADMIN">
      <DashboardShell>{children}</DashboardShell>
    </AuthGuard>
  );
}
