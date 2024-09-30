"use client";

import {
  CircleDashed,
  BoxSelect,
  Layers,
  Image as LImage,
  Square,
} from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession, getCsrfToken } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  getBgStyles,
  getClientSideCookie,
  rembg,
  getImageStyle,
  myPhotoControlers,
  calcPercentage,
  calcPx,
  onDownload,
  getBorderStyles,
} from "@/lib/common";
import { useUploadThing } from "@/lib/uploadthing";
import { uid } from "uid";
import Image from "next/image";
import DragAndDrop from "@/components/dragAndDrop";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import DownloadImage from "@/components/downloadImage";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";
import { ControlerValue, SessionData } from "@/lib/interfaces";
import MyPhotoControler from "@/components/customize/MyPhotoControler";
import Border from "@/components/customize/Border";
import Background from "@/components/customize/Background";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createControler } from "@/lib/actions/services";

export default function Customize() {
  const { selectedImage, controlerValue, setControlerValue, toggleLogin } =
    useAppProvider();
  const router = useRouter();
  if (!selectedImage) router.push("/");

  const [imageWrapperSize, setImageWrapperSize] = useState<number>(100);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  // const { data: session } = useSession() as { data: SessionData | null };

  const [activeTab, setActiveTab] = useState<string>("MY_PHOTO");
  const [menu] = useState(() => [
    {
      label: "My Photo",
      code: "MY_PHOTO",
      icon: selectedImage && (
        <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full">
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
      ),
    },
    { label: "Border", code: "BORDER", icon: <Square className="h-6 w-6" /> },
    {
      label: "Background",
      code: "BACKGROUND",
      icon: <LImage className="h-6 w-6" />,
    },
  ]);

  // function handleDrop(e: any, ui: { x: number; y: number }) {
  //   setControlerValue({
  //     ...controlerValue,
  //     ["transform"]: {
  //       x: imageWrapperRef?.current?.offsetWidth
  //         ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.x)
  //         : 0,
  //       y: imageWrapperRef?.current?.offsetWidth
  //         ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.y)
  //         : 0,
  //     },
  //   });
  // }

  async function downloadImage() {
    function callback(blob: Blob) {
      console.log(blob, "dataUrl123");
      if (selectedImage?._id && blob && controlerValue)
        createControler({
          controler: controlerValue,
          imageId: selectedImage._id,
          blob,
        });
    }
    await onDownload(imageWrapperRef.current, callback);
  }

  console.log(controlerValue, "controlerValue123");

  return (
    <main className="text-black body-font container">
      <div className="mb-12 flex justify-between">
        <div className="flex">
          <EditBar />
        </div>
        <Button
          variant="ghost"
          onClick={downloadImage}
          className={`${constants.btnClass} rounded-full mr-4 `}
        >
          Download
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 rounded-md ">
          {menu.map((item) => (
            <Button
              key={item.code}
              variant="ghost"
              onClick={() => setActiveTab(item.code)}
              className={`${constants.btnClass} w-full mb-2 justify-start ${
                activeTab === item.code
                  ? "bg-violet-500 text-white"
                  : "bg-background"
              }`}
            >
              {item.icon}
              <span className="px-2">{item.label}</span>
            </Button>
          ))}
        </div>
        <div className="col-span-4 drop-shadow-2xl p-4 bg-background dark:text-white">
          {activeTab === "MY_PHOTO" && <MyPhotoControler />}
          {activeTab === "BORDER" && <Border />}
          {activeTab === "BACKGROUND" && <Background />}
        </div>
        <div className="col-span-6 bg-[url('/images/grid.svg')] outline-dashed outline-[#9C92AC20] drop-shadow-2xl p-8 bg-background">
          <div className="aspect-w-1 aspect-h-1">
            <div
              className={`outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25]`}
            >
              <div ref={imageWrapperRef} className="relative w-full h-full">
                {selectedImage && controlerValue && (
                  <DownloadImage
                    image={selectedImage}
                    controler={controlerValue}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
