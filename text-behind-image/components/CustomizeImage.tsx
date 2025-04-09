"use client";

import {
  Download,
  Image as LImage,
  LoaderCircle,
  Plus,
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
import {
  addText,
  getDefaultControler,
  getUniqueRandomWord,
} from "../utils/common";
import CanvaEditor from "@/components/canvaEditor";
import { Stage as StageType } from "konva/lib/Stage";
import { Slider } from "@/components/ui/slider";

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

  const [controler, setControler] = useState<TBIControlerValue>({
    texts: [addText({ text: "TEXT" })],
    imageWrapperSize: 0,
    bgBlur: 0,
    imageSrc: null,
    rbgSrc: null,
  });

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

  function downloadImage() {
    // const canvas = canvasRef.current;
    // if (!canvas || !controler.rbgSrc) return;
    // const dataUrl = canvas.toDataURL("image/png");
    // const link = document.createElement("a");
    // link.download = "text-behind-image.png";
    // link.href = dataUrl;
    // link.click();

    const stage = stageRef.current;
    if (!stage) return;

    const dataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
    const link = document.createElement("a");
    link.download = "text-behind-image";
    link.href = dataURL;
    link.click();

    // const json = stageRef.current?.toJSON();
    // const blob = new Blob([json || ""], { type: "application/json" });
    // const url = URL.createObjectURL(blob);

    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "canvas.json";
    // a.click();
    // URL.revokeObjectURL(url);
  }

  function addNewText() {
    let { texts = [] } = { ...controler };
    const randomWord = getUniqueRandomWord(texts.map((i) => i.text));
    texts.push(addText({ text: randomWord || "Edit" }));
    updateControler({ texts });
  }

  const disabled = globalLoader || !controler.imageSrc;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
        <div>
          <div className="bg-[url('/images/grid.svg')] drop-shadow-xl border border-input bg-background">
            <div ref={imageWrapperRef} className="relative">
              {controler.imageSrc ? (
                <div className="md:min-h-[64vh] flex items-center justify-center w-full h-full overflow-hidden w-full outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25]">
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

          <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4 mt-4 flex justify-between items-center">
            <Button
              onClick={downloadImage}
              variant="outline"
              className={cn(
                "relative rounded-md text-sm md:mr-2",
                disabled ? "cursor-not-allowed" : ""
              )}
              disabled={disabled}
            >
              Download
              <span className="hidden md:inline-block">&nbsp;Image</span>
              <Download className="ml-2 w-5 h-5 text-violet-500" />
            </Button>
            <Button
              onClick={() => updateControler({ imageSrc: "", rbgSrc: "" })}
              variant="outline"
              className={cn(
                "relative rounded-md text-sm md:ml-2",
                disabled ? "cursor-not-allowed" : ""
              )}
              disabled={disabled}
            >
              Reset
              <RotateCcw className="ml-2 w-5 h-5 text-violet-500" />
            </Button>
          </div>
        </div>
        <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4">
          <div className="flex justify-between items-center">
            <div className="mt-2 flex-1 ">
              <label className="text-sm font-medium flex justify-between items-center w-full">
                <span>Background Blur</span>
                <span>{controler.bgBlur}</span>
              </label>
              <Slider
                value={[controler.bgBlur || 0]}
                min={0}
                max={10}
                onValueChange={(value) => updateControler({ bgBlur: value[0] })}
                disabled={disabled}
              />
            </div>

            <Button
              variant="outline"
              className={cn(
                "flex-none relative rounded-md text-sm mx-2",
                disabled ? "cursor-not-allowed" : ""
              )}
              disabled={disabled}
              onClick={addNewText}
            >
              Add Text
              {/* <Plus className="ml-2 w-5 h-5 text-violet-500" /> */}
            </Button>
          </div>

          <Text
            controler={controler}
            disabled={disabled}
            updateControler={updateControler}
          />
        </div>
      </div>
    </>
  );
}
