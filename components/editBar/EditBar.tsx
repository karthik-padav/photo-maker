"use client";

import { Image as LucideImage, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { useAppProvider } from "../../lib/app-provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { client } from "@gradio/client";
import { rembg } from "@/lib/common";
import { uid } from "uid";
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
import { getCookie } from "@/lib/actions/server.action";
import axios from "axios";
import DrawerWrapper from "@/components/drawerWrapper";
// import MyPhotos from "./MyPhotos";
import Link from "next/link";
import GenerateImageBtn from "../generateImageBtn";

interface SessionData {
  user: { email: string; photos: string[] };
}

export default function EditBar() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const {
    controlerValue,
    selectedImage,
    setControlerValue,
    toggleLogin,
    setSelectedImage,
  } = useAppProvider();
  const [loader, setLoader] = useState<{ imageGenerator: boolean }>({
    imageGenerator: false,
  });

  // async function onImageGenerate(e: React.ChangeEvent<HTMLInputElement>) {
  //   const cookies = await getCookie();
  //   let file: File | null = e?.target?.files?.[0] || null;
  //   if (file) {
  //     try {
  //       setLoader((prev) => ({ ...prev, imageGenerator: true }));
  //       let blob = new Blob([file], { type: file.type });
  //       blob = await rembg(blob);
  //       if (!blob) throw new Error("'Blob not found");
  //       const formData = new FormData();
  //       formData.append("file", blob, file.name);
  //       const { data } = await axios.post(
  //         `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/generateImage`,
  //         formData,
  //         { headers: { Authorization: `Bearer ${cookies?.value}` } }
  //       );
  //       console.log(data, "response123");
  //       setSelectedImage(data);
  //       setLoader((prev) => ({ ...prev, imageGenerator: false }));
  //     } catch (error) {
  //       console.log(error);
  //       setLoader((prev) => ({ ...prev, imageGenerator: false }));
  //     }
  //   }
  // }

  return (
    <>
      <GenerateImageBtn
        className={`${constants.btnClass} rounded-full mr-4 mr-4 `}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`${constants.btnClass} rounded-full mr-4 `}
          >
            <div
              className={`${controlerValue?.border?.value} h-6 w-6 border-dotted border-2 border-black mr-2`}
            />
            {controlerValue?.border?.title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {constants.borders.map((i) => (
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
      <Link
        className={`${constants.btnClass} rounded-full h-12 px-4 py-2 flex justify-center items-center`}
        href="/myphotos"
      >
        My Photos
      </Link>
    </>
  );
}
