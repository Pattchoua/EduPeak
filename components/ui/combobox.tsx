"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps {
  options: {
    label: string;
    value: string;
  }[];
  value?: string;
  onChange: (value: string) => void;
}

export const Combobox = ({ options, value, onChange }: ComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border p-2 rounded hover:bg-gray-100"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : "Select options..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4 shadow-lg">
        <Command>
          <CommandInput placeholder="Search option..." className="p-2 border rounded" />
          <CommandEmpty>No option found.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value === value ? "" : option.value);
                  setOpen(false);
                }}
                className="py-2 px-4 hover:bg-gray-100"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "text-green-500" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
