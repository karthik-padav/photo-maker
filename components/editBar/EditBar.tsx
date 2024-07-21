"use client";

import { Image as LucideImage, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useAppProvider } from "../app-provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { client } from "@gradio/client";
import { rembg } from "@/lib/common";
import { useUploadThing } from "@/lib/uploadthing";
import { uid } from "uid";
import { fetchImages, updateImage } from "@/lib/actions/image.actions";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import constants from "@/lib/constants";
import EditPhoto from "./EditPhoto";

interface SessionData {
  user: { email: string; photos: string[] };
}

const borders = [
  { title: "Round", value: "rounded-full" },
  { title: "Rounded Corners", value: "rounded-3xl" },
  { title: "Square", value: "" },
];

export default function EditBar() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const { controlerValue, setControlerValue } = useAppProvider();
  return (
    <>
      <EditPhoto />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="border-white drop-shadow-2xl rounded-full p-6"
          >
            <div
              className={`${controlerValue.border.value} h-6 w-6 border-dotted border-2 border-black mr-2`}
            />
            {controlerValue.border.title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {borders.map((i) => (
            <DropdownMenuItem
              key={i.value}
              onClick={() => setControlerValue({ border: i })}
            >
              <div
                className={`${i.value} h-6 w-6 border-dotted border-2 border-black mr-2`}
              />
              {i.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
