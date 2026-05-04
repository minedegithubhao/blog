import { AuthGuard } from "@/modules/auth/components/auth-guard";
import { MePageView } from "@/modules/auth/components/me-page-view";

export default function MePage() {
  return (
    <AuthGuard>
      <MePageView />
    </AuthGuard>
  );
}
