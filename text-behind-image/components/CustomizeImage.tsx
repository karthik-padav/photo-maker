"use client";

import {
  Download,
  Image as LImage,
  LoaderCircle,
  RotateCcw,
  Square,
} from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState, useCallback, useEffect } from "react";
import {
  downloadBlob,
  onHfImageGenerate,
  onImageGenerate,
  resizedImage,
} from "@/lib/common";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import constants from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ADS from "@/components/ads";
import { useToast } from "@/hooks/use-toast";
import { SessionData } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { TBIControlerValue } from "@/text-behind-image/interfaces";
import ImageSettings from "./ImageSettings";
import Text from "./Text";
import { ScrollArea } from "@/components/ui/scroll-area";
import Dropzone from "@/components/dropzone";
import { getDefaultControler } from "../utils/common";
import CanvaEditor from "@/components/canvaEditor";
import { Stage as StageType } from "konva/lib/Stage";

const MENU_ITEMS = [
  {
    label: "Text",
    code: "TEXT",
  },
  {
    label: "Image",
    code: "IMAGE",
  },
];

export default function CustomizeImage() {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<StageType | null>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const { globalLoader, setGlobalLoader, toggleLogin } = useAppProvider();
  const { toast } = useToast();
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const [controler, setControler] = useState<TBIControlerValue>(() => {
    // const savedValue = localStorage.getItem("savedValue");
    let savedValue;
    return savedValue ? JSON.parse(savedValue) : {};
  });

  // useEffect(() => {
  //   const imageSrc = new window.Image();
  //   imageSrc.src = "/images/temp_rm.jpg";
  //   imageSrc.crossOrigin = "anonymous";
  //   imageSrc.onload = () => updateControler({ imageSrc });

  //   const rbgSrc = new window.Image();
  //   rbgSrc.src = "/images/temp_rm.png";
  //   rbgSrc.crossOrigin = "anonymous";
  //   rbgSrc.onload = () => updateControler({ rbgSrc });
  // }, []);

  useEffect(() => {
    if (imageWrapperRef?.current?.offsetWidth)
      updateControler({
        imageWrapperSize: imageWrapperRef.current.offsetWidth,
      });
  }, [imageWrapperRef?.current?.offsetWidth]);

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e?.target?.files?.[0];

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
      // if (process.env.NEXT_PUBLIC_ENABLE_HF === "true")
      //   promises.push(onHfImageGenerate(e));
      if (process.env.NEXT_PUBLIC_ENABLE_IMGL === "true")
        promises.push(onImageGenerate(e));
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
      console.log(resp, "resp123");

      const imageSrc = new window.Image();
      imageSrc.src = URL.createObjectURL(file);
      imageSrc.crossOrigin = "anonymous";
      imageSrc.onload = () => updateControler({ imageSrc });

      const rbgSrc = new window.Image();
      rbgSrc.src = imagePath;
      rbgSrc.crossOrigin = "anonymous";
      rbgSrc.onload = () => updateControler({ rbgSrc });
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
    // else setControler({});
  }

  // useEffect(() => {
  //   if (!canvasRef.current || !controler.rbgSrc || !controler.imageSrc) return;

  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) return;

  //   const imgRatio = controler.imageSrc.width / controler.imageSrc.height;

  //   canvas.width = controler?.imageWrapperSize || 300;
  //   canvas.height = (controler?.imageWrapperSize || 300) / imgRatio;

  //   const canvasRatio = canvas.width / canvas.height;

  //   let drawWidth, drawHeight, offsetX, offsetY;

  //   if (imgRatio > canvasRatio) {
  //     // Image is wider than canvas
  //     drawWidth = canvas.width;
  //     drawHeight = canvas.width / imgRatio;
  //     offsetX = 0;
  //     offsetY = (canvas.height - drawHeight) / 2; // Center vertically
  //   } else {
  //     // Image is taller than canvas
  //     drawWidth = canvas.height * imgRatio;
  //     drawHeight = canvas.height;
  //     offsetX = (canvas.width - drawWidth) / 2; // Center horizontally
  //     offsetY = 0;
  //   }

  //   ctx.filter = `
  //                 brightness(${controler.bgBrightness}%)
  //                 contrast(${controler.bgContrast}%)
  //                 saturate(${controler.bgSaturate}%)
  //                 hue-rotate(${controler.bgHueRotate}deg)
  //                 grayscale(${controler.bgGrayscale}%)
  //                 sepia(${controler.bgSepia}%)
  //                 invert(${controler.bgInvert}%)
  //                 blur(${controler.bgBlur}px)
  //               `;
  //   ctx.drawImage(controler.imageSrc, offsetX, offsetY, drawWidth, drawHeight);
  //   ctx.filter = "none"; // Reset filter for future drawings

  //   (controler.texts || []).forEach((textSet) => {
  //     ctx.save();

  //     // Set up text properties
  //     ctx.font = `${textSet.fontWeight} ${textSet.fontSize * 3}px ${
  //       textSet.fontFamily
  //     }`;
  //     ctx.fillStyle = textSet.color;
  //     ctx.globalAlpha = textSet.opacity;
  //     ctx.textAlign = "center";
  //     ctx.textBaseline = "middle";

  //     const x = (canvas.width * (textSet.left + 50)) / 100;
  //     const y = (canvas.height * (50 - textSet.top)) / 100;

  //     // Move to position first
  //     ctx.translate(x, y);

  //     // Apply 3D transforms
  //     const tiltXRad = (-textSet.tiltX * Math.PI) / 180;
  //     const tiltYRad = (-textSet.tiltY * Math.PI) / 180;

  //     // Use a simpler transform that maintains the visual tilt
  //     ctx.transform(
  //       Math.cos(tiltYRad), // Horizontal scaling
  //       Math.sin(0), // Vertical skewing
  //       -Math.sin(0), // Horizontal skewing
  //       Math.cos(tiltXRad), // Vertical scaling
  //       0, // Horizontal translation
  //       0 // Vertical translation
  //     );

  //     // Apply rotation last
  //     ctx.rotate((textSet.rotation * Math.PI) / 180);

  //     // Draw text at transformed position
  //     ctx.fillText(textSet.text, 0, 0);
  //     ctx.restore();
  //   });

  //   ctx.drawImage(controler.rbgSrc, offsetX, offsetY, drawWidth, drawHeight);

  //   // return () => {
  //   //   localStorage.setItem("savedValue", JSON.stringify(controler));
  //   // };
  // }, [controler]);

  function downloadImage() {
    // const canvas = canvasRef.current;
    // if (!canvas || !controler.rbgSrc) return;
    // const dataUrl = canvas.toDataURL("image/png");
    // const link = document.createElement("a");
    // link.download = "text-behind-image.png";
    // link.href = dataUrl;
    // link.click();

    // const stage = stageRef.current;
    // if (!stage) return;

    // const dataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
    // const link = document.createElement("a");
    // link.download = "text-behind-image";
    // link.href = dataURL;
    // link.click();

    const json = stageRef.current?.toJSON();
    const blob = new Blob([json || ""], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  console.log(controler, "image123");
  const disabled = globalLoader || !controler.imageSrc;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
        <div>
          <div className="bg-[url('/images/grid.svg')] drop-shadow-xl border bg-background">
            <div ref={imageWrapperRef} className="relative">
              {controler.imageSrc ? (
                <div className="flex items-center justify-center w-full h-full overflow-hidden w-full outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25]">
                  <CanvaEditor
                    elements={controler}
                    canvaWidth={controler.imageWrapperSize}
                    updateControler={updateControler}
                    ref={stageRef as React.RefObject<StageType>}
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center aspect-w-1 aspect-h-1 relative">
                  <div className="p-2 md:p-4">
                    <Dropzone
                      onChange={onImageChange}
                      disabled={disabled}
                      otherAttr={{
                        loading: globalLoader,
                        requireLogin: true,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* <div className="bg-[url('/images/grid.svg')] drop-shadow-xl border bg-background">
            <div className="relative overflow-hidden">
              <Image
                src={controler.imageSrc || ""}
                alt="Uploaded"
                width={800}
                height={800}
                objectPosition="center"
              />
              {(controler.texts || []).map((textSet) => (
                <div
                  key={textSet.id}
                  style={{
                    position: "absolute",
                    top: `${50 - textSet.top}%`,
                    left: `${textSet.left + 50}%`,
                    transform: `
                                  translate(-50%, -50%) 
                                  rotate(${textSet.rotation}deg)
                                  perspective(1000px)
                                  rotateX(${textSet.tiltX}deg)
                                  rotateY(${textSet.tiltY}deg)
                              `,
                    color: textSet.color,
                    textAlign: "center",
                    fontSize: `${textSet.fontSize * 3}px`,
                    fontWeight: textSet.fontWeight,
                    fontFamily: textSet.fontFamily,
                    opacity: textSet.opacity,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {textSet.text}
                </div>
              ))}
              <Image
                src={controler.rbgSrc || ""}
                alt="Removed bg"
                layout="fill"
                objectFit="contain"
                objectPosition="center"
                className="absolute top-0 left-0 w-full h-full"
              />
            </div>
          </div> */}

          <div className="drop-shadow-xl border bg-background p-2 md:p-4 mt-4 flex justify-between items-center">
            <Button
              onClick={downloadImage}
              variant="outline"
              className={cn(
                "relative rounded-md text-sm md:mr-2",
                disabled ? "cursor-progress" : ""
              )}
              disabled={disabled}
            >
              Download
              <span className="hidden md:inline-block">&nbsp;Image</span>
              <Download className="ml-2 w-5 h-5 text-violet-500" />
            </Button>
            <Button
              onClick={() => updateControler(getDefaultControler(controler))}
              variant="outline"
              className={cn(
                "relative rounded-md text-sm md:ml-2",
                disabled ? "cursor-progress" : ""
              )}
              disabled={disabled}
            >
              Reset <span className="hidden md:inline-block">&nbsp;Image</span>
              <RotateCcw className="ml-2 w-5 h-5 text-violet-500" />
            </Button>
          </div>
        </div>
        <div className="drop-shadow-xl border bg-background p-2 md:p-4">
          <Tabs defaultValue="TEXT" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {MENU_ITEMS.map((item) => (
                <TabsTrigger value={item.code} key={item.code}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value="TEXT">
              <ScrollArea className="h-80 w-full text-left">
                <Text
                  controler={controler}
                  disabled={disabled}
                  updateControler={updateControler}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="IMAGE">
              <ScrollArea className="h-80 w-full">
                <ImageSettings
                  controler={controler}
                  disabled={disabled}
                  updateControler={updateControler}
                />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
