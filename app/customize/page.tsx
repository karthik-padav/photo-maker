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
import { createControler, getWebsiteData } from "@/lib/actions/services";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export default function Customize() {
  const { selectedImage, controlerValue, user } = useAppProvider();
  const router = useRouter();
  const session = useSession();
  if (!selectedImage || !session?.data) router.push("/");

  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<string>("MY_PHOTO");
  const [showDialog, toggleDialog] = useState<boolean>(false);
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

  async function downloadImage() {
    const ENABLE_PAYMENT = process.env.NEXT_PUBLIC_ENABLE_PAYMENT === "true";
    const credit = process.env.NEXT_PUBLIC_PRICE_PER_DOWNLOAD
      ? parseInt(process.env.NEXT_PUBLIC_PRICE_PER_DOWNLOAD)
      : 3;
    function callback(blob: Blob) {
      if (selectedImage?._id && blob && controlerValue)
        createControler({
          controler: controlerValue,
          imageId: selectedImage._id,
          blob,
        });
    }
    if (ENABLE_PAYMENT && user?.credit && credit > Number(user.credit)) {
      toggleDialog(true);
    } else await onDownload(imageWrapperRef.current, callback);
  }

  useEffect(() => {
    init();
    async function init() {
      const { data: websiteDate } = await getWebsiteData();
    }
  }, []);

  return (
    <main className="text-black body-font container">
      <div className="mb-12 ">
        <div className="flex flex-wrap gap-2">
          <EditBar />
          <Button
            variant="ghost"
            onClick={downloadImage}
            className={`${constants.btnClass} rounded-full mr-4 `}
          >
            Download
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2 rounded-md">
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
        <div className="col-span-12 md:col-span-4 drop-shadow-2xl p-4 bg-background dark:text-white">
          {activeTab === "MY_PHOTO" && <MyPhotoControler />}
          {activeTab === "BORDER" && <Border />}
          {activeTab === "BACKGROUND" && <Background />}
        </div>
        <div className="col-span-12 md:col-span-6 bg-[url('/images/grid.svg')] outline-dashed outline-[#9C92AC20] drop-shadow-2xl p-4 md:p-8 bg-background flex justify-center items-center">
          <div className="w-full">
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
      </div>

      <AlertDialog open={showDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Low Credit Alert!</AlertDialogTitle>
            <AlertDialogDescription>
              Your current credit balance is too low to proceed. Please add more
              credit to continue using the service without interruptions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={() => toggleDialog(false)}
              className={`${constants.btnClass} rounded-full hover:bg-background`}
            >
              Cancel
            </Button>
            <Link
              href="/"
              className={`${constants.btnClass} rounded-full flex justify-center items-center bg-violet-500`}
            >
              Add Credit
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
