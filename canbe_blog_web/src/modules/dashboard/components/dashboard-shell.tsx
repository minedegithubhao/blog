"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookText,
  Bot,
  File,
  FileText,
  Folder,
  Globe,
  LayoutDashboard,
  Menu as MenuIcon,
  ScrollText,
  Settings,
  Tag,
  User,
  Users,
  Wallet,
  X
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStoredUser } from "@/modules/auth/utils/auth-storage";
import { getCurrentUserNavigation } from "@/modules/dashboard/api/navigation-api";
import { DashboardAccessProvider } from "@/modules/dashboard/components/dashboard-access-context";
import type { CurrentUserNavigation } from "@/modules/dashboard/types/navigation";
import type { MenuTreeNode } from "@/modules/system/types/menu";

type NavLeaf = {
  key: string;
  href: string;
  label: string;
  icon: string;
  breadcrumb: string[];
};

type NavGroup = {
  key: string;
  label: string;
  icon: string;
  children: NavLeaf[];
};

type TabItem = {
  key: string;
  href: string;
  label: string;
  closable: boolean;
};

const FALLBACK_ICON = FileText;
const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Settings,
  User,
  Users,
  FileText,
  Folder,
  Tag,
  BookText,
  File,
  ScrollText,
  Bot,
  Wallet,
  Menu: MenuIcon
};

const dashboardFallbackLeaf: NavLeaf = {
  key: "dashboard",
  href: "/dashboard",
  label: "仪表盘",
  icon: "LayoutDashboard",
  breadcrumb: ["仪表盘"]
};

function getIconComponent(icon?: string) {
  return (icon && iconMap[icon]) || FALLBACK_ICON;
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function flattenMenuTree(nodes: MenuTreeNode[], ancestors: string[] = []): NavLeaf[] {
  const leaves: NavLeaf[] = [];

  for (const node of nodes) {
    if (node.type === "BUTTON") {
      continue;
    }

    const breadcrumb = [...ancestors, node.title];
    if (node.type === "MENU") {
      leaves.push({
        key: node.name,
        href: node.path,
        label: node.title,
        icon: node.icon,
        breadcrumb
      });
    }

    if (node.children.length) {
      leaves.push(...flattenMenuTree(node.children, breadcrumb));
    }
  }

  return leaves;
}

function buildGroups(nodes: MenuTreeNode[]): { standaloneLeaves: NavLeaf[]; groups: NavGroup[] } {
  const standaloneLeaves: NavLeaf[] = [];
  const groups: NavGroup[] = [];

  for (const node of nodes) {
    if (node.type === "BUTTON") {
      continue;
    }

    if (node.type === "MENU") {
      standaloneLeaves.push({
        key: node.name,
        href: node.path,
        label: node.title,
        icon: node.icon,
        breadcrumb: [node.title]
      });
      continue;
    }

    groups.push({
      key: node.name,
      label: node.title,
      icon: node.icon,
      children: flattenMenuTree(node.children, [node.title])
    });
  }

  return { standaloneLeaves, groups };
}

function findLeafByPath(pathname: string | null, leaves: NavLeaf[]) {
  if (!pathname || !leaves.length) {
    return dashboardFallbackLeaf;
  }

  const exactMatch = leaves.find((leaf) => pathname === leaf.href);
  if (exactMatch) {
    return exactMatch;
  }

  return (
    [...leaves]
      .sort((left, right) => right.href.length - left.href.length)
      .find((leaf) => pathname.startsWith(`${leaf.href}/`)) ?? dashboardFallbackLeaf
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <DashboardShellInner>{children}</DashboardShellInner>
    </SidebarProvider>
  );
}

function DashboardShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [navigation, setNavigation] = useState<CurrentUserNavigation>({ menus: [], permissions: [] });
  const [loading, setLoading] = useState(true);
  const currentUser = useMemo(() => getStoredUser(), []);
  const tabsStorageKey = currentUser?.id ? `canbe_blog_tabs_${currentUser.id}` : "";
  const restoredTabsRef = useRef(false);

  const { standaloneLeaves, groups } = useMemo(() => buildGroups(navigation.menus), [navigation.menus]);
  const leaves = useMemo(() => {
    const flattened = flattenMenuTree(navigation.menus);
    return flattened.length ? flattened : [dashboardFallbackLeaf];
  }, [navigation.menus]);
  const leavesByKey = useMemo(() => new Map(leaves.map((item) => [item.key, item])), [leaves]);
  const currentLeaf = useMemo(() => findLeafByPath(pathname, leaves), [pathname, leaves]);
  const [tabs, setTabs] = useState<TabItem[]>([]);

  useEffect(() => {
    let ignore = false;

    async function loadNavigation() {
      setLoading(true);
      try {
        const result = await getCurrentUserNavigation();
        if (!ignore) {
          setNavigation(result);
        }
      } catch (error) {
        if (!ignore) {
          toast.error(error instanceof Error ? error.message : "加载导航失败");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadNavigation();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (loading || restoredTabsRef.current) {
      return;
    }

    if (tabsStorageKey) {
      const rawTabs = window.localStorage.getItem(tabsStorageKey);
      if (rawTabs) {
        try {
          const parsed = JSON.parse(rawTabs) as { tabs?: TabItem[] };
          const restoredTabs = (parsed.tabs ?? []).filter((tab) => leavesByKey.has(tab.key));
          setTabs(restoredTabs);
        } catch {
          window.localStorage.removeItem(tabsStorageKey);
        }
      }
    }

    restoredTabsRef.current = true;
  }, [loading, tabsStorageKey, leavesByKey]);

  useEffect(() => {
    if (!restoredTabsRef.current) {
      return;
    }

    const currentTab: TabItem = {
      key: currentLeaf.key,
      href: currentLeaf.href,
      label: currentLeaf.label,
      closable: currentLeaf.key !== dashboardFallbackLeaf.key
    };

    setTabs((previous) => {
      if (previous.some((tab) => tab.key === currentTab.key)) {
        return previous;
      }
      return [...previous, currentTab];
    });
  }, [currentLeaf]);

  useEffect(() => {
    if (!restoredTabsRef.current || !tabsStorageKey) {
      return;
    }

    window.localStorage.setItem(
      tabsStorageKey,
      JSON.stringify({
        activeTabKey: currentLeaf.key,
        tabs
      })
    );
  }, [currentLeaf.key, tabs, tabsStorageKey]);

  function handleMenuLink(key: string) {
    const leaf = leavesByKey.get(key);
    if (!leaf) {
      return;
    }
    router.push(leaf.href);
  }

  function closeTab(targetKey: string) {
    if (targetKey === dashboardFallbackLeaf.key) {
      return;
    }

    setTabs((previous) => {
      const nextTabs = previous.filter((tab) => tab.key !== targetKey);

      if (currentLeaf.key === targetKey) {
        const fallback =
          nextTabs[nextTabs.length - 1] ?? {
            key: dashboardFallbackLeaf.key,
            href: dashboardFallbackLeaf.href,
            label: dashboardFallbackLeaf.label,
            closable: false
          };
        router.push(fallback.href);
      }

      return nextTabs;
    });
  }

  return (
    <DashboardAccessProvider value={{ menus: navigation.menus, permissions: navigation.permissions, loading }}>
      <>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="border-b px-4 py-3">
            <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#3F3FF3,#6366f1)]">
                <span className="text-xs font-bold text-white">C</span>
              </div>
              {!collapsed ? <span className="truncate text-sm font-semibold text-[#333]">Canbe Blog 管理系统</span> : null}
            </Link>
          </SidebarHeader>
          <SidebarContent>
            {standaloneLeaves.map((leaf) => {
              const Icon = getIconComponent(leaf.icon);
              return (
                <SidebarGroup key={leaf.key}>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={currentLeaf.key === leaf.key}
                          tooltip={leaf.label}
                          className="cursor-pointer"
                          onClick={() => router.push(leaf.href)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{leaf.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}

            {groups.map((group) => {
              const GroupIcon = getIconComponent(group.icon);
              return (
                <SidebarGroup key={group.key}>
                  <SidebarGroupLabel className="flex items-center gap-2">
                    <GroupIcon className="h-4 w-4" />
                    <span>{group.label}</span>
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.children.map((leaf) => {
                        const Icon = getIconComponent(leaf.icon);
                        return (
                          <SidebarMenuItem key={leaf.key}>
                            <SidebarMenuButton
                              isActive={currentLeaf.key === leaf.key}
                              tooltip={leaf.label}
                              className="cursor-pointer"
                              onClick={() => router.push(leaf.href)}
                            >
                              <Icon className="h-4 w-4" />
                              <span>{leaf.label}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="乘风博客" className="cursor-pointer" onClick={() => router.push("/blog")}>
                      <Globe className="h-4 w-4" />
                      <span>乘风博客</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="bg-[#f5f5f5]">
          <header className="sticky top-0 z-20 border-b bg-white">
            <div className="flex h-12 min-w-0 items-center justify-between px-4">
              <div className="flex min-w-0 items-center gap-2">
                <SidebarTrigger className="cursor-pointer text-[#606266] hover:bg-[#f5f5f5] hover:text-[#303133]" />
                <span className="ml-2 min-w-0 truncate text-sm text-[#999]">
                  {currentLeaf.breadcrumb.length === 2 ? (
                    <>
                      {currentLeaf.breadcrumb[0]} / <span className="text-[#333]">{currentLeaf.breadcrumb[1]}</span>
                    </>
                  ) : (
                    <span className="text-[#333]">{currentLeaf.breadcrumb[0]}</span>
                  )}
                </span>
              </div>
            </div>
          </header>

          <div className="min-w-0 max-w-full overflow-hidden border-b bg-white px-3 pt-2">
            <Tabs value={currentLeaf.key} className="min-w-0 max-w-full gap-0">
              <TabsList className="h-auto max-w-full rounded-none bg-transparent p-0">
                <div className="scrollbar-none flex max-w-full items-end gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {tabs.map((tab) => (
                    <div
                      key={tab.key}
                      className={classNames(
                        "relative -mb-px flex shrink-0 items-center rounded-t-[6px] border border-b-0 pr-3",
                        tab.key === currentLeaf.key ? "border-[#dcdfe6] bg-white text-[#3F3FF3]" : "border-[#e8e8e8] bg-[#fafafa] text-[#606266]"
                      )}
                    >
                      <TabsTrigger
                        value={tab.key}
                        onClick={() => handleMenuLink(tab.key)}
                        className={classNames(
                          "h-9 cursor-pointer rounded-none border-0 bg-transparent px-4 shadow-none focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none",
                          tab.key === currentLeaf.key ? "font-medium text-[#3F3FF3]" : "text-[#606266]"
                        )}
                      >
                        {tab.label}
                      </TabsTrigger>
                      {tab.closable ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => closeTab(tab.key)}
                          className="h-5 w-5 cursor-pointer text-[#999] hover:text-[#666]"
                          title={`关闭 ${tab.label}`}
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </TabsList>
            </Tabs>
          </div>

          <main className="min-w-0 max-w-full overflow-x-clip p-4">{children}</main>
        </SidebarInset>
      </>
    </DashboardAccessProvider>
  );
}
