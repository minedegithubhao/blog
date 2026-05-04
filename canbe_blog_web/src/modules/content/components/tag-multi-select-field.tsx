"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type TagOption = {
  label: string;
  value: number;
};

export function TagMultiSelectField({
  value,
  onChange,
  options
}: {
  value: number[];
  onChange: (value: number[]) => void;
  options: TagOption[];
}) {
  const [open, setOpen] = useState(false);
  const selectedValues = useMemo(() => new Set(value), [value]);
  const selectedLabels = options.filter((option) => selectedValues.has(option.value)).map((option) => option.label);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" className="w-full justify-between cursor-pointer">
          <span className="truncate">{selectedLabels.length ? selectedLabels.join("、") : "请选择标签"}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start">
        <Command>
          <CommandInput placeholder="搜索标签..." />
          <CommandList>
            <CommandEmpty>暂无可选标签</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const checked = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    value={`${option.label}-${option.value}`}
                    onSelect={() => {
                      if (checked) {
                        onChange(value.filter((item) => item !== option.value));
                        return;
                      }
                      onChange([...value, option.value]);
                    }}
                  >
                    <Check className={checked ? "opacity-100" : "opacity-0"} aria-hidden="true" />
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
