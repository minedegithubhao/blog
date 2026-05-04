"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { listMenuTree } from "@/modules/system/api/menu-api";
import type { MenuTreeNode } from "@/modules/system/types/menu";

type FlatMenuOption = {
  id: number;
  title: string;
  depth: number;
  disabled: boolean;
};

export function MenuTreeSelectField({
  value,
  onChange,
  currentMenuId,
  refreshKey
}: {
  value: number;
  onChange: (value: number) => void;
  currentMenuId?: number;
  refreshKey?: number;
}) {
  const [open, setOpen] = useState(false);
  const [tree, setTree] = useState<MenuTreeNode[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadTree() {
      setLoading(true);
      try {
        const nextTree = await listMenuTree();
        if (!ignore) {
          setTree(nextTree);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadTree();
    return () => {
      ignore = true;
    };
  }, [refreshKey]);

  const disabledIds = useMemo(() => {
    if (!currentMenuId) {
      return new Set<number>();
    }

    const nextDisabledIds = new Set<number>([currentMenuId]);

    function collectDescendants(nodes: MenuTreeNode[]) {
      for (const node of nodes) {
        if (node.id === currentMenuId) {
          appendChildren(node.children);
        } else {
          collectDescendants(node.children);
        }
      }
    }

    function appendChildren(children: MenuTreeNode[]) {
      for (const child of children) {
        nextDisabledIds.add(child.id);
        appendChildren(child.children);
      }
    }

    collectDescendants(tree);
    return nextDisabledIds;
  }, [currentMenuId, tree]);

  const options = useMemo(() => {
    const flattened: FlatMenuOption[] = [{ id: 0, title: "顶级菜单", depth: 0, disabled: false }];

    function append(nodes: MenuTreeNode[], depth: number) {
      for (const node of nodes) {
        if (node.type === "BUTTON") {
          continue;
        }
        flattened.push({
          id: node.id,
          title: node.title,
          depth,
          disabled: disabledIds.has(node.id)
        });
        append(node.children, depth + 1);
      }
    }

    append(tree, 0);
    return flattened;
  }, [disabledIds, tree]);

  const currentOption = options.find((option) => option.id === value) ?? options[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between cursor-pointer">
          <span className="truncate">{currentOption?.title ?? "请选择上级菜单"}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="搜索菜单名称..." />
          <CommandList>
            <CommandEmpty>{loading ? "加载中..." : "暂无可选菜单"}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  value={`${option.title}-${option.id}`}
                  disabled={option.disabled}
                  onSelect={() => {
                    if (option.disabled) {
                      return;
                    }
                    onChange(option.id);
                    setOpen(false);
                  }}
                >
                  <Check className={value === option.id ? "opacity-100" : "opacity-0"} aria-hidden="true" />
                  <span style={{ paddingLeft: option.depth === 0 ? 0 : option.depth * 12 }}>{option.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
