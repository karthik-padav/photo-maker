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

export default function EditBar() {
  const { controlerValue, setControlerValue } = useAppProvider();

  return (
    <>
      <GenerateImageBtn className={`${constants.btnClass} rounded-full`} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`${constants.btnClass} rounded-full`}
          >
            <div
              className={`${controlerValue?.border?.value} h-4 w-4 md:h-6 md:w-6 dark:border-white border-dotted border-2 border-black mr-2`}
            />
            {controlerValue?.border?.title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-46 md:w-56">
          {constants.borders.map((i) => (
            <DropdownMenuItem
              key={i.value}
              onClick={() => setControlerValue({ border: i })}
            >
              <div
                className={`${i.value} h-4 w-4 md:h-6 md:w-6 dark:border-white border-dotted border-2 border-black mr-2`}
              />
              {i.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        className={`${constants.btnClass} rounded-full flex justify-center items-center`}
        href="/myphotos"
      >
        My Photos
      </Link>
    </>
  );
}
