"use client";

import { Image as LImage, Square } from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState, useCallback } from "react";
import { onDownload } from "@/lib/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DownloadImage from "@/components/downloadImage";
import { createControler } from "@/lib/actions/services";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import constants from "@/lib/constants";
import MyPhotoControler from "@/components/customize/MyPhotoControler";
import Border from "@/components/customize/Border";
import Background from "@/components/customize/Background";
import EditBar from "@/components/editBar";

const MENU_ITEMS = [
  {
    label: "My Photo",
    code: "MY_PHOTO",
    icon: (image) =>
      image && (
        <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full">
          <Image
            placeholder="blur"
            blurDataURL={constants.blurDataURL}
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`}
            fill
            sizes="100%"
            style={{ objectFit: "cover" }}
            alt="profile pic"
            loading="lazy"
          />
        </div>
      ),
  },
  {
    label: "Border",
    code: "BORDER",
    icon: () => <Square className="h-6 w-6" />,
  },
  {
    label: "Background",
    code: "BACKGROUND",
    icon: () => <LImage className="h-6 w-6" />,
  },
];

export default function Customize() {
  const { selectedImage, controlerValue, user } = useAppProvider();
  const router = useRouter();
  const session = useSession();
  const imageWrapperRef = useRef(null);
  const [activeTab, setActiveTab] = useState("MY_PHOTO");
  const [showDialog, setShowDialog] = useState(false);

  if (!selectedImage || !session?.data) router.push("/");

  const downloadImage = useCallback(async () => {
    const ENABLE_PAYMENT = process.env.NEXT_PUBLIC_ENABLE_PAYMENT === "true";
    const credit = process.env.NEXT_PUBLIC_PRICE_PER_DOWNLOAD
      ? parseInt(process.env.NEXT_PUBLIC_PRICE_PER_DOWNLOAD)
      : 3;

    if (ENABLE_PAYMENT && user?.credit && credit > Number(user.credit)) {
      setShowDialog(true);
      return;
    }

    await onDownload(imageWrapperRef.current, async (blob) => {
      if (selectedImage?.id && blob && controlerValue) {
        await createControler({
          controler: controlerValue,
          imageId: selectedImage.id,
          blob,
        });
      }
    });
  }, [selectedImage, controlerValue, user]);

  return (
    <main className="text-black container mx-auto">
      <div className="mb-12 flex flex-wrap gap-2">
        <EditBar />
        <Button
          variant="ghost"
          onClick={downloadImage}
          className={`${constants.btnClass} rounded-full mr-4`}
        >
          Download
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2 rounded-md">
          {MENU_ITEMS.map(({ label, code, icon }) => (
            <Button
              key={code}
              variant="ghost"
              onClick={() => setActiveTab(code)}
              className={`${constants.btnClass} w-full mb-2 justify-start ${
                activeTab === code
                  ? "bg-violet-500 text-white"
                  : "bg-background"
              }`}
            >
              {icon(selectedImage)}
              <span className="px-2">{label}</span>
            </Button>
          ))}
        </div>
        <div className="col-span-12 md:col-span-4 drop-shadow-2xl p-4 bg-background dark:text-white">
          {activeTab === "MY_PHOTO" && <MyPhotoControler />}
          {activeTab === "BORDER" && <Border />}
          {activeTab === "BACKGROUND" && <Background />}
        </div>
        <div className="col-span-12 md:col-span-6 bg-[url('/images/grid.svg')] outline-dashed outline-[#9C92AC20] drop-shadow-2xl p-4 md:p-8 bg-background flex justify-center items-center">
          <div className="w-full aspect-w-1 aspect-h-1 outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25] relative">
            <div ref={imageWrapperRef} className="w-full h-full">
              {selectedImage && (
                <DownloadImage
                  image={selectedImage}
                  controler={controlerValue ?? undefined}
                />
              )}
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
              onClick={() => setShowDialog(false)}
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
