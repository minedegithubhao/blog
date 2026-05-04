"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { MenuTreeNode } from "@/modules/system/types/menu";

type DashboardAccessContextValue = {
  menus: MenuTreeNode[];
  permissions: string[];
  loading: boolean;
};

const DashboardAccessContext = createContext<DashboardAccessContextValue>({
  menus: [],
  permissions: [],
  loading: true
});

export function DashboardAccessProvider({
  value,
  children
}: {
  value: DashboardAccessContextValue;
  children: ReactNode;
}) {
  return <DashboardAccessContext.Provider value={value}>{children}</DashboardAccessContext.Provider>;
}

export function useDashboardAccess() {
  return useContext(DashboardAccessContext);
}
