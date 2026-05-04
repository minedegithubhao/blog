"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth-api";
import type { CurrentUser } from "../types/auth";
import { clearLoginSession, getAuthToken, getStoredUser, saveCurrentUser } from "../utils/auth-storage";

type AuthGuardProps = {
  children: ReactNode;
  requiredRole?: string;
};

export function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUser | null>(() => getStoredUser());
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function checkSession() {
      if (!getAuthToken()) {
        clearLoginSession();
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        if (ignore) {
          return;
        }
        saveCurrentUser(currentUser);
        setUser(currentUser);
        if (requiredRole && currentUser.roleCode !== requiredRole) {
          router.replace("/me");
          return;
        }
      } catch {
        clearLoginSession();
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      } finally {
        if (!ignore) {
          setIsChecking(false);
        }
      }
    }

    void checkSession();
    return () => {
      ignore = true;
    };
  }, [pathname, requiredRole, router]);

  if (isChecking) {
    return null;
  }

  if (!user || (requiredRole && user.roleCode !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
