"use client";

import {
  Bold,
  Copy,
  Italic,
  Image as LImage,
  LoaderCircle,
  Palette,
  Plus,
  Square,
  Trash2,
  Underline,
} from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  downloadBlob,
  onHfImageGenerate,
  onImageGenerate,
  resizedImage,
} from "@/lib/common";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import constants from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ADS from "@/components/ads";
import { useToast } from "@/hooks/use-toast";
import { SessionData } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { TBIControlerValue } from "@/text-behind-image/interfaces";
import {
  addText,
  getUniqueRandomWord,
  renderFontStyles,
} from "@/text-behind-image/utils/common";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { uid } from "uid";
import FontPicker from "./FontPicker";
import { renderTextRange } from "../utils/common";

export default function Text({
  controler,
  updateControler,
  disabled = false,
}: {
  controler: TBIControlerValue;
  updateControler: (value) => void;
  disabled: boolean;
}) {
  function addNewText() {
    let { texts = [] } = { ...controler };
    const randomWord = getUniqueRandomWord(texts.map((i) => i.text));
    texts.push(addText({ text: randomWord || "edit" }));
    updateControler({ texts });
  }

  function deleteText(id: string) {
    let { texts = [] } = { ...controler };
    updateControler({ texts: texts.filter((i) => i.id != id) });
  }

  function duplicate(index) {
    let { texts = [] } = { ...controler };
    const newTexts = [...texts];
    newTexts.splice(index, 0, { ...texts[index], id: uid(16) });
    updateControler({ texts: newTexts });
  }

  function handleField(value, field, item) {
    let { texts = [] } = { ...controler };
    const updatedTexts = texts.map((i) =>
      i.id === item.id ? { ...i, [field]: value } : i
    );
    updateControler({ texts: updatedTexts });
  }

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative rounded-md text-sm",
          disabled ? "cursor-progress" : ""
        )}
        disabled={disabled}
        onClick={addNewText}
      >
        Add Text
        <Plus className="ml-2 w-5 h-5 text-violet-500" />
      </Button>

      <Accordion
        type="single"
        collapsible
        className="w-full"
        disabled={disabled}
      >
        {(controler?.texts || []).map((item, index) => (
          <AccordionItem value={item.id} key={item.id}>
            <div className="flex items-center">
              <div className="grow">
                <AccordionTrigger>{item.text}</AccordionTrigger>
              </div>
              <div className="flex pl-2">
                <Button
                  variant="ghost"
                  onClick={() => duplicate(index)}
                  disabled={disabled}
                  className="p-2 mx-1 border hover:text-violet-500 dark:text-white drop-shadow-2xl bg-transparent"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => deleteText(item.id)}
                  disabled={disabled}
                  className="p-2 mx-1 border hover:text-red-500 dark:text-white drop-shadow-2xl bg-transparent"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <AccordionContent>
              <div className="flex justify-between items-center mt-2">
                <input
                  type="text"
                  className="flex rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-b-violet-500 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  value={item.text}
                  onChange={(e) => handleField(e.target.value, "text", item)}
                />
                {renderFontStyles(item).map((b, index) => (
                  <Button
                    key={index}
                    variant={b?.variant as "ghost" | undefined}
                    className="p-2 mx-1 border dark:text-white drop-shadow-2xl"
                    onClick={() => handleField(b.value, b.name, item)}
                    disabled={disabled}
                  >
                    {b.icon}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 mt-2">
                  <label className="text-sm font-medium">Font Size</label>
                  <input
                    className="flex rounded-md border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-b-violet-500 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    min="10"
                    type="number"
                    value={item.fontSize}
                    disabled={disabled}
                    onChange={(e) =>
                      handleField(Number(e.target.value), "fontSize", item)
                    }
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <label className="text-sm font-medium">Font Family</label>
                  <FontPicker
                    currentFont={item.fontFamily}
                    disabled={disabled}
                    handleAttributeChange={(data) =>
                      handleField(data, "fontFamily", item)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderTextRange(item).map((i, index) => (
                  <div className="space-y-2 mt-2" key={index}>
                    <label className="text-sm font-medium flex justify-between items-center w-full">
                      <span>{i.label}</span>
                      <span>
                        {i.postfix
                          ? `${i.attr.value}${i.postfix}`
                          : i.attr.value}
                      </span>
                    </label>
                    <input
                      className="slider bg-violet-500 rounded-full disabled:cursor-not-allowed disabled:opacity-50 w-full"
                      {...i.attr}
                      type="range"
                      disabled={disabled}
                      onChange={(e) =>
                        handleField(Number(e.target.value), i.attr.name, item)
                      }
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
