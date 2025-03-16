"use client";

import { Button } from "../ui/button";
import constants from "@/lib/constants";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { SelectedImage, SessionData } from "@/lib/interfaces";
import { useAppProvider } from "@/lib/app-provider";
import { onHfImageGenerate, onImageGenerate } from "@/lib/common";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/lib/actions/services";
import { removeBackground } from "@imgly/background-removal";
import imageCompression from "browser-image-compression";
import { usePathname } from "next/navigation";

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

    if (!file) return;
    const maxSize = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE);
    if (!isNaN(maxSize) && file.size > maxSize * 1024 * 1024) {
      toast({
        variant: "default",
        description: "File size should be less than 3MB.",
      });
      return;
    }
    setGlobalLoader(true);
    try {
      if (
        process.env.NEXT_PUBLIC_ENABLE_IMGL != "true" &&
        process.env.NEXT_PUBLIC_ENABLE_HF != "true"
      ) {
        toast({
          variant: "destructive",
          description: "Oops! No background remover found.",
        });
        return;
      }
      const options = {
        maxSizeMB: 4,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      let promises: Promise<Blob | null>[] = [];
      if (process.env.NEXT_PUBLIC_ENABLE_HF === "true")
        promises.push(onHfImageGenerate(e));
      if (process.env.NEXT_PUBLIC_ENABLE_IMGL === "true")
        // promises.push(removeBackground(file));
        promises.push(onImageGenerate(e));
      let blob = (await Promise.any(promises)) as Blob;

      if (blob.size / (1024 * 1024) > 4) {
        const compressedFile = new File([blob], file.name, { type: blob.type });
        blob = await imageCompression(compressedFile, options);
      }

      if (blob) pathname != "/generate" && router.push("/generate");
      else
        toast({
          variant: "destructive",
          description: "Oops! Something went wrong.",
        });

      void (async () => {
        try {
          const { data = null } = (await generateImage({
            blob,
            fileName: file.name,
          })) as { data: SelectedImage };

          if (data) {
            setSelectedImage(data);
          } else {
            toast({
              variant: "destructive",
              description: "Oops! Something went wrong.",
            });
          }
        } catch (error) {
          console.error("Error generating image:", error);
        }
      })();
    } catch (error) {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: (error as Error).message,
      });
    } finally {
      setGlobalLoader(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        className={className}
        onClick={
          // () => inputFileRef?.current?.click()
          () => (session?.user ? inputFileRef?.current?.click() : toggleLogin())
        }
        disabled={globalLoader}
      >
        {selectedImage && (
          <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full border-1 border-black mr-2 drop-shadow-md">
            <Image
              placeholder="blur"
              blurDataURL={constants.blurDataURL}
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedImage.imagePath}`}
              fill
              sizes="100%"
              style={{ objectFit: "cover" }}
              alt="profile pic"
              loading="lazy"
            />
          </div>
        )}
        {selectedImage ? "Replace Image" : title}
        <input hidden type="file" ref={inputFileRef} onChange={onImageChange} />
      </Button>
    </>
  );
}
