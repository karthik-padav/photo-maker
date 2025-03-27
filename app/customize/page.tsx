"use client";

import { Image as LImage, Square } from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState, useCallback, useEffect } from "react";
import { downloadBlob, resizedImage } from "@/lib/common";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { uid } from "uid";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import * as htmlToImage from "html-to-image";
import ADS from "@/components/ads";
import DownloadImage from "@/components/downloadImage";

const MENU_ITEMS = [
  {
    label: "Image",
    code: "MY_PHOTO",
  },
  {
    label: "Border",
    code: "BORDER",
  },
  {
    label: "Background",
    code: "BACKGROUND",
  },
];

export default function Customize() {
  const { selectedImage, controlerValue, user, globalLoader } =
    useAppProvider();
  const router = useRouter();
  const session = useSession();
  const imageWrapperRef = useRef(null);
  const [activeTab, setActiveTab] = useState("MY_PHOTO");
  const [showDialog, setShowDialog] = useState(false);
  const [isloading, setLoader] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Redirect after component mounts
  useEffect(() => {
    if (!selectedImage || !session?.data) {
      router.push("/");
    }
  }, [selectedImage, session?.data, router]);

  async function downloadImage() {
    const ENABLE_PAYMENT = process.env.NEXT_PUBLIC_ENABLE_PAYMENT === "true";
    const credit = process.env.NEXT_PUBLIC_PRICE_PER_DOWNLOAD
      ? parseInt(process.env.NEXT_PUBLIC_PRICE_PER_DOWNLOAD)
      : 3;

    if (ENABLE_PAYMENT && user?.credit && credit > Number(user.credit)) {
      setShowDialog(true);
      return;
    }

    setLoader(true);

    // try {
    //   const node = document.getElementById("wrapper");
    //   if (!node) return false;
    //   let canvas = await htmlToImage.toCanvas(node);

    //   const blob = (await resizedImage(canvas)) as Blob;
    //   // let dataURL = canvas.toDataURL("image/png");
    //   // const blob = await (await fetch(dataURL)).blob();

    //   if (selectedImage?.id && blob && controlerValue) {
    //     const { data } = await createControler({
    //       controler: controlerValue,
    //       imageId: selectedImage.id,
    //       blob,
    //     });
    //     if (data)
    //       downloadBlob(
    //         blob,
    //         `${process.env.NEXT_PUBLIC_WEBSITE_CODE}_${uid(16)}`
    //       );
    //   }
    // } catch (error) {
    //   throw new Error(String(error));
    // } finally {
    //   setLoader(false);
    // }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const blob = (await resizedImage(canvas)) as Blob;
      if (selectedImage?.id && blob && controlerValue) {
        const { data } = await createControler({
          controler: controlerValue,
          imageId: selectedImage.id,
          blob,
        });
        if (data)
          downloadBlob(
            blob,
            `${process.env.NEXT_PUBLIC_WEBSITE_CODE}_${uid(16)}`
          );
      }
    } catch (error) {
      throw new Error(String(error));
    } finally {
      setLoader(false);
    }
  }

  function donwload() {
    const node = document.getElementById("wrapper");
    if (node) {
      htmlToImage
        .toPng(node)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = "image"; // Set the filename
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // Clean up
        })
        .catch((err) => {
          console.error("oops, something went wrong!", err);
        });
    } else {
      console.error("Node not found!");
    }
  }

  return (
    <main className="px-2 md:px-0 md:container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6">
        <div className="col-span-2">
          <ADS />
        </div>
        <div className="col-span-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
            <div className="col-span-1 md:col-span-2 mb-4 md:mb-12 flex flex-wrap gap-2">
              <EditBar />
              <Button
                variant="ghost"
                disabled={isloading}
                onClick={downloadImage}
                className={`${constants.btnClass} rounded-full mr-4 relative`}
              >
                {isloading && (
                  <span className="absolute top-0 bottom-0 left-o right-0 w-full flex justify-center items-center">
                    <LoaderCircle className="animate-spin" />
                  </span>
                )}
                <span className={`${isloading ? "opacity-0" : ""}`}>
                  Download
                </span>
              </Button>
            </div>
            <div className="bg-[url('/images/grid.svg')] outline-dashed outline-[#9C92AC20] drop-shadow-2xl p-2 md:p-4 bg-background">
              <div className="w-full aspect-w-1 aspect-h-1 outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25] relative">
                <div
                  id="wrapper"
                  ref={imageWrapperRef}
                  className="w-full h-full"
                >
                  {selectedImage && (
                    <DownloadImage
                      image={selectedImage}
                      controler={controlerValue ?? undefined}
                      canvasRef={canvasRef}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="drop-shadow-2xl p-6 md:p-4 bg-background">
              <Tabs defaultValue="MY_PHOTO" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  {MENU_ITEMS.map((item) => (
                    <TabsTrigger value={item.code} key={item.code}>
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <TabsContent value="MY_PHOTO">
                  <MyPhotoControler />
                </TabsContent>
                <TabsContent value="BORDER">
                  <Border />
                </TabsContent>
                <TabsContent value="BACKGROUND">
                  <Background />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <ADS />
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
