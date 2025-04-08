"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { ChevronDown } from "lucide-react";

interface FontFamilyPickerProps {
  // attribute: string;
  currentFont: string;
  handleAttributeChange: (value: string) => void;
  disabled: boolean;
}

const FontPicker: React.FC<FontFamilyPickerProps> = ({
  // attribute,
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
                  className={cn("hover:cursor-pointer")}
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
