"use client";

import { Button } from "../ui/button";
import constants from "@/lib/constants";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { SessionData } from "@/lib/interfaces";
import { useAppProvider } from "@/lib/app-provider";
import { onImageGenerate } from "@/lib/common";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";

export default function GenerateImageBtn({
  className = constants.btnClass,
  title = "Upload Photo",
}: {
  className?: string;
  title?: string;
}) {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const {
    globalLoader,
    selectedImage,
    setGlobalLoader,
    toggleLogin,
    setSelectedImage,
  } = useAppProvider();
  const { toast } = useToast();

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGlobalLoader(true);
    const { data } = { ...(await onImageGenerate(e)) };
    if (data) {
      setSelectedImage(data);
      router.push("/generate");
    } else
      toast({
        variant: "destructive",
        description: "Oops Something went worng.",
      });

    setGlobalLoader(false);
  }
  return (
    <>
      <Button
        variant="ghost"
        className={className}
        onClick={() =>
          session?.user ? inputFileRef?.current?.click() : toggleLogin()
        }
        disabled={globalLoader}
      >
        {selectedImage && (
          <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full border-1 border-black mr-2 drop-shadow-md">
            <Image
              placeholder="blur"
              blurDataURL={constants.blurDataURL}
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedImage.imageKey}`}
              layout="fill"
              objectFit="cover"
              alt="profile pic"
              loading="lazy"
            />
          </div>
        )}
        {selectedImage ? "Replace Image" : title}
        <input hidden type="file" ref={inputFileRef} onChange={onImageChange} />
      </Button>
    </>
  );
}
