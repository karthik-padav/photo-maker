"use client";

import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import {
  downloadBlob,
  onHfImageGenerate,
  onImageGenerate,
  resizedImage,
} from "@/lib/common";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ControlerValue, SessionData } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import Dropzone from "@/components/dropzone";
import { uid } from "uid";
import MyPhotoControler from "@/components/customize/MyPhotoControler";
import Border from "@/components/customize/Border";
import Background from "@/components/customize/Background";
import DownloadImage from "@/components/downloadImage";
import { getAllBgImage } from "@/lib/actions/services";
import { preload } from "@imgly/background-removal";
import dynamic from "next/dynamic";

const RotateCcw = dynamic(
  () => import("lucide-react").then((mod) => mod.RotateCcw),
  {
    loading: () => <span>Loading...</span>,
  }
);
const Download = dynamic(
  () => import("lucide-react").then((mod) => mod.Download),
  {
    loading: () => <span>Loading...</span>,
  }
);

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

export default function PPM() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const { globalLoader, setGlobalLoader, toggleLogin } = useAppProvider();
  const { toast } = useToast();
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const [bgImages, setBgImages] = useState<{ key: string; url: string }[]>([]);

  const [controler, setControler] = useState<ControlerValue>(() => ({
    pngBorderColor: "rgb(0, 0, 0)",
    outerBorderColor: "rgb(0, 0, 0)",
    imageWrapperSize: 0,
    rotate: 0,
    scale: 1,
    pngShadow: "0",
    transformX: 0,
    transformY: 0,
    backgroundColorType: "",
    backgroundColor: "",
    outerBorderOpacity: "1",
    outerBorderWidth: "0",
    outerBorderRadius: "0",
    backgroundRotate: "0",
    backgroundImagePath: "",
    backgroundScale: "1",
    imageSrc: null,
  }));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (imageWrapperRef?.current?.offsetWidth)
      updateControler({
        imageWrapperSize: imageWrapperRef.current.offsetWidth,
      });
  }, [imageWrapperRef?.current?.offsetWidth]);

  async function onImageChange(files: React.ChangeEvent<HTMLInputElement>) {
    const file = files?.[0];

    let loaderToast;

    if (!file) return;
    const maxSize = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE);
    if (!isNaN(maxSize) && file.size > maxSize * 1024 * 1024) {
      toast({
        variant: "destructive",
        description: "File Size Should Be Less Than 3MB.",
      });
      return;
    }
    loaderToast = toast({
      title: "We're Generating Your Image.",
      description:
        "This may take a few minutes depending on the image size. Thanks for your patience!",
      duration: Infinity,
    });
    setGlobalLoader(true);

    try {
      if (
        process.env.NEXT_PUBLIC_ENABLE_IMGL != "true" &&
        process.env.NEXT_PUBLIC_ENABLE_HF != "true"
      ) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "No Background Remover Found.",
        });
        return;
      }
      let promises: Promise<Blob | null | string>[] = [];
      if (process.env.NEXT_PUBLIC_ENABLE_HF === "true")
        promises.push(onHfImageGenerate(file));
      if (process.env.NEXT_PUBLIC_ENABLE_IMGL === "true")
        promises.push(onImageGenerate(file));
      let resp = (await Promise.any(promises)) as Blob | string | null;

      if (!resp) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something Went Wrong.",
          description: "There Was A Problem With Your Request.",
        });
        return;
      }
      const imagePath =
        typeof resp === "string" ? resp : URL.createObjectURL(resp);

      const imageSrc = new window.Image();
      imageSrc.src = imagePath;
      imageSrc.crossOrigin = "anonymous";
      imageSrc.onload = () => updateControler({ imageSrc });
    } catch (error) {
      console.log("Error", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There Was A Problem With your request.",
      });
    } finally {
      if (loaderToast) loaderToast.dismiss();
      setGlobalLoader(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  }

  function updateControler(data) {
    if (data) setControler((prev) => ({ ...prev, ...data }));
  }

  async function downloadImage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const blob = (await resizedImage(canvas)) as Blob;
    downloadBlob(blob, `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-${uid(16)}`);
  }

  useEffect(() => {
    async function init() {
      preload()
        .then(() => {
          console.log("Assets preloaded successfully");
        })
        .catch((error) => {
          console.error("Error preloading assets:", error);
        });
      const { data } = await getAllBgImage();
      if (data) setBgImages(data);
    }
    init();
  }, []);

  const disabled = globalLoader || !controler.imageSrc;
  const maxSize = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
        <div>
          <div className="bg-[url('/images/grid.svg')] outline-dashed outline-[#9C92AC20] drop-shadow-2xl bg-background">
            <div id="wrapper" ref={imageWrapperRef} className="w-full h-full">
              {controler.imageSrc ? (
                <div className="flex items-center justify-center w-full h-full overflow-hidden w-full outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25]">
                  <DownloadImage
                    controler={controler ?? undefined}
                    canvasRef={canvasRef}
                    updateControler={updateControler}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center aspect-w-1 aspect-h-1 relative">
                  <div className="p-2 md:p-4">
                    <Dropzone
                      onChange={onImageChange}
                      disabled={disabled}
                      loading={globalLoader}
                      requireLogin={true}
                      session={session}
                      toggleLogin={toggleLogin}
                      description={`PNG, JPG or WEBP ${
                        maxSize ? `(MAX.${maxSize}MB)` : ""
                      }`}
                      inputProps={{ accept: "image/*", type: "file" }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4 mt-4 flex justify-between items-center">
            <Button
              onClick={downloadImage}
              aria-label="Download"
              variant="outline"
              className={cn(
                "hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:mr-2"
              )}
              disabled={disabled}
            >
              Download
              <Download className="ml-2 w-5 h-5" />
            </Button>
            <Button
              aria-label="Rest"
              onClick={() => updateControler({ imageSrc: "" })}
              variant="outline"
              className={cn(
                "hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:ml-2"
              )}
              disabled={disabled}
            >
              Reset
              <RotateCcw className="ml-2 w-5 h-5 hover:text-white" />
            </Button>
          </div>
        </div>
        <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4">
          <Tabs defaultValue="MY_PHOTO" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              {MENU_ITEMS.map((item) => (
                <TabsTrigger
                  value={item.code}
                  key={item.code}
                  className="data-[state=active]:bg-violet-500 data-[state=active]:text-white"
                >
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="MY_PHOTO">
              <MyPhotoControler
                controler={controler}
                updateControler={updateControler}
                disabled={disabled}
              />
            </TabsContent>
            <TabsContent value="BORDER">
              <Border
                controler={controler}
                updateControler={updateControler}
                disabled={disabled}
              />
            </TabsContent>
            <TabsContent value="BACKGROUND">
              <Background
                controler={controler}
                updateControler={updateControler}
                bgImages={bgImages}
                disabled={disabled}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
