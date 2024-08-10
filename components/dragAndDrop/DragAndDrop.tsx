"use client";

import { Image as LucideImage, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useAppProvider } from "../../lib/app-provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { client } from "@gradio/client";
import { rembg } from "@/lib/common";
import { useUploadThing } from "@/lib/uploadthing";
import { uid } from "uid";
import { fetchImages, updateImage } from "@/lib/actions/image.actions";
import Image from "next/image";

interface SessionData {
  user: { email: string; photos: string[] };
}

export default function DragAndDrop({
  loader,
  handleChange,
}: {
  loader: Boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}) {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const { toggleLogin } = useAppProvider();
  return (
    <Button
      variant="outline"
      className={`relative border-2 border-gray-300 border-dashed rounded-lg p-4 w-full h-96 ${
        loader && "cursor-not-allowed"
      }`}
      onClick={() =>
        session?.user ? inputFileRef?.current?.click() : toggleLogin()
      }
      disabled={!!loader}
    >
      <input hidden type="file" ref={inputFileRef} onChange={handleChange} />
      <div className="text-center">
        {loader && (
          <p className={`${loader ? "" : "absolute"} flex items-center`}>
            <LoaderCircle className="animate-spin mr-2" />
            Generating Image
          </p>
        )}
        <h3
          className={`${
            loader ? "opacity-0 absolute" : "opacity-100"
          } mt-2 text-sm font-medium text-gray-900`}
        >
          <label className="relative cursor-pointer">
            <span>Drag and drop</span>
            <span className="text-indigo-600"> or browse </span>
            <span>to upload</span>
          </label>
          <span className="block mt-1 text-xs text-gray-500">
            PNG, JPG up to 5MB
          </span>
        </h3>
      </div>
    </Button>
  );
}
