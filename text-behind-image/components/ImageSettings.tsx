"use client";

import {
  Bold,
  Copy,
  Italic,
  Image as LImage,
  LoaderCircle,
  Palette,
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
  renderImageRange,
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

export default function ImageSettings({
  controler,
  updateControler,
  disabled = false,
}: {
  controler: TBIControlerValue;
  updateControler: (value) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderImageRange(controler).map((i, index) => (
        <div className="space-y-2 mt-2" key={index}>
          <label className="text-sm font-medium flex justify-between items-center w-full">
            <span>{i.label}</span>
            <span>{i.attr.value}</span>
          </label>
          <input
            className="slider bg-violet-500 rounded-full disabled:cursor-not-allowed disabled:opacity-50 w-full"
            {...i.attr}
            type="range"
            disabled={disabled}
            onChange={(e) =>
              updateControler({ [i.attr.name]: parseInt(e.target.value) })
            }
          />
        </div>
      ))}
    </div>
  );
}
