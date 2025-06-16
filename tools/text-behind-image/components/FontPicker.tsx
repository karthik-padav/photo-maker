"use client";
import "@/app/fonts.css";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ALL_FONTS } from "../utils/fonts";
import dynamic from "next/dynamic";

const ChevronDown = dynamic(
  () => import("lucide-react").then((mod) => mod.ChevronDown),
  {
    loading: () => <span>Loading...</span>,
  }
);

interface FontFamilyPickerProps {
  currentFont: string;
  handleAttributeChange: (value: string) => void;
  disabled: boolean;
}

const FontPicker: React.FC<FontFamilyPickerProps> = ({
  currentFont,
  handleAttributeChange,
  disabled = true,
}) => {
  return (
    <Popover>
      <div className="flex flex-col items-start justify-start">
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-label={currentFont || "Font"}
            disabled={disabled}
            className={cn(
              "w-full justify-between hover:bg-background py-1.5",
              !currentFont && "text-muted-foreground"
            )}
          >
            {currentFont ? currentFont : "Select font family"}
            <ChevronDown className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search font family..." className="h-9" />
          <CommandList>
            <CommandEmpty>No font family found.</CommandEmpty>
            <CommandGroup heading="All Fonts">
              {ALL_FONTS.map((font) => (
                <CommandItem
                  value={font}
                  key={font}
                  onSelect={() => handleAttributeChange(font)}
                  className={cn(
                    "hover:cursor-pointer",
                    currentFont === font && "bg-violet-500 text-white"
                  )}
                  style={{ fontFamily: font }}
                >
                  {font}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FontPicker;
