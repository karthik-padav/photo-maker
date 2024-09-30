"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import constants from "@/lib/constants";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { SessionData } from "@/lib/interfaces";
import { useAppProvider } from "@/lib/app-provider";
import { onImageGenerate } from "@/lib/common";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGlobalLoader(true);
    const { data } = { ...(await onImageGenerate(e)) };
    // const data = {
    //   imageKey: "80ad21e868f90e98.png",
    //   bucket: "photo-maker",
    //   email: "karthikpadav@gmail.com",
    //   active: true,
    //   _id: "66f58e79559830563f643a0e",
    //   createdAt: "2024-09-26T16:40:25.633Z",
    //   updatedAt: "2024-09-26T16:40:25.633Z",
    //   __v: 0,
    // };
    console.log(data, "data123");
    if (data) {
      setSelectedImage(data);
      router.push("/generate");
    } else {
      console.log("error");
    }
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
