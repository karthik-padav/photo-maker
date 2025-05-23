"use client";

import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect } from "react";
import { onHfImageGenerate, onImageGenerate } from "@/lib/common";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SessionData } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import { TBIControlerValue } from "@/tools/text-behind-image/interfaces";
import Text from "./Text";
import Dropzone from "@/components/dropzone";
import { addText, getUniqueRandomWord } from "../utils/common";
import CanvaEditor from "@/components/canvaEditor";
import { Stage as StageType } from "konva/lib/Stage";
import { Slider } from "@/components/ui/slider";
import { uid } from "uid";
import { preload } from "@imgly/background-removal";
import dynamic from "next/dynamic";

const Download = dynamic(
  () => import("lucide-react").then((mod) => mod.Download),
  {
    loading: () => <span>Loading...</span>,
  }
);

const RotateCcw = dynamic(
  () => import("lucide-react").then((mod) => mod.RotateCcw),
  {
    loading: () => <span>Loading...</span>,
  }
);

export default function TBI() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<StageType | null>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const { toggleLogin } = useAppProvider();
  const [loading, setLoader] = useState<boolean>(false);
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
    preload()
      .then(() => {
        console.log("Assets preloaded successfully");
      })
      .catch((error) => {
        console.error("Error preloading assets:", error);
      });
  }, []);

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
    setLoader(true);

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
      setLoader(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  }

  function updateControler(data) {
    if (data) setControler((prev) => ({ ...prev, ...data }));
    // else setControler({});
  }

  function downloadImage() {
    const stage = stageRef.current;
    if (!stage) return;
    const dataURL = stage.toDataURL({ pixelRatio: 2, mimeType: "image/png" });
    const link = document.createElement("a");
    link.download = `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-${uid(16)}`;
    link.href = dataURL;
    link.click();
  }

  function addNewText() {
    let { texts = [] } = { ...controler };
    const randomWord = getUniqueRandomWord(texts.map((i) => i.text));
    texts.push(addText({ text: randomWord || "Edit" }));
    updateControler({ texts });
  }

  const disabled = loading || !controler.imageSrc;
  const maxSize = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:pb-6">
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
                      loading={loading}
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
              <Download className="ml-2 w-5 h-5 text-violet-500 hover:text-white" />
            </Button>
            <Button
              aria-label="Rest"
              onClick={() => updateControler({ imageSrc: "", rbgSrc: "" })}
              variant="outline"
              className={cn(
                "hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:ml-2"
              )}
              disabled={disabled}
            >
              Reset
              <RotateCcw className="ml-2 w-5 h-5 text-violet-500 hover:text-white" />
            </Button>
          </div>
        </div>
        <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4">
          <div className="flex justify-between items-center">
            <div className="mt-2 flex-1">
              <label
                htmlFor="backgroundBlur"
                className="text-sm font-medium flex justify-between items-center w-full"
              >
                <span>Background Blur</span>
                <span>{controler.bgBlur}</span>
              </label>
              <Slider
                id="backgroundBlur"
                value={[controler.bgBlur || 0]}
                min={0}
                max={10}
                onValueChange={(value) => updateControler({ bgBlur: value[0] })}
                disabled={disabled}
              />
            </div>

            <Button
              variant="outline"
              aria-label="Add Text"
              className={cn(
                "hover:bg-violet-500 hover:text-white text-violet-500 flex-none relative rounded-full text-sm mx-2"
              )}
              disabled={disabled}
              onClick={addNewText}
            >
              Add Text
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
