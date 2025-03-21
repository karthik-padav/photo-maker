"use client";

import { Button } from "../ui/button";
import constants from "@/lib/constants";
import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { SelectedImage, SessionData } from "@/lib/interfaces";
import { useAppProvider } from "@/lib/app-provider";
import { onHfImageGenerate, onImageGenerate } from "@/lib/common";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/lib/actions/services";
import imageCompression from "browser-image-compression";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function GenerateImageBtn({
  className = constants.btnClass,
  title = "Upload Photo",
}: {
  className?: string;
  title?: string;
}) {
  const router = useRouter();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const {
    globalLoader,
    selectedImage,
    setGlobalLoader,
    toggleLogin,
    setSelectedImage,
  } = useAppProvider();
  const { toast } = useToast();
  const pathname = usePathname();

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
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      let promises: Promise<Blob | null | string>[] = [];
      if (process.env.NEXT_PUBLIC_ENABLE_HF === "true")
        promises.push(onHfImageGenerate(e));
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
      setSelectedImage({ id: "fakeId", imagePath, key: "fakeKey" });
      if (pathname === "/") router.push("/generate");

      (async function () {
        let blob = resp;
        if (typeof blob === "string") {
          try {
            const response = await fetch(blob);
            blob = await response.blob();
          } catch (e) {
            console.error(e);
            return;
          }
        }

        if (blob instanceof Blob) {
          if (blob.size / (1024 * 1024) > 4) {
            const compressedFile = new File([blob], file.name, {
              type: blob.type,
            });
            blob = await imageCompression(compressedFile, options);
          }
          const { data = null } = (await generateImage({
            blob,
            fileName: file.name,
          })) as { data: SelectedImage };
          if (data) {
            setSelectedImage({
              id: data.id,
              imagePath: `${process.env.NEXT_PUBLIC_IMAGE_URL}${data.imagePath}`,
              key: data.imagePath,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There Was A Problem With Your Request.",
            });
            setSelectedImage(null);
          }
        } else {
          setSelectedImage(null);
          console.error("Response is not of type Blob");
        }
      })();
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

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "relative",
          className,
          globalLoader ? "cursor-progress" : ""
        )}
        onClick={() =>
          session?.user ? inputFileRef?.current?.click() : toggleLogin()
        }
        disabled={globalLoader}
      >
        {globalLoader && (
          <span className="absolute top-0 bottom-0 left-o right-0 w-full flex justify-center items-center">
            <LoaderCircle className="animate-spin" />
          </span>
        )}
        <div
          className={`flex justify-center items-center ${
            globalLoader ? "opacity-0" : ""
          }`}
        >
          {selectedImage && (
            <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full border-1 border-black mr-2 drop-shadow-md">
              <Image
                placeholder="blur"
                blurDataURL={constants.blurDataURL}
                src={selectedImage.imagePath}
                fill
                sizes="100%"
                style={{ objectFit: "cover" }}
                alt="profile pic"
                loading="lazy"
              />
            </div>
          )}
          {selectedImage ? "Replace Image" : title}
          <input
            hidden
            type="file"
            ref={inputFileRef}
            onChange={onImageChange}
          />
        </div>
      </Button>
    </>
  );
}
