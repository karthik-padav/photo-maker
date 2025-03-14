"use client";

import { Button } from "../ui/button";
import constants from "@/lib/constants";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { SelectedImage, SessionData } from "@/lib/interfaces";
import { useAppProvider } from "@/lib/app-provider";
import { onHfImageGenerate } from "@/lib/common";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { generateImage } from "@/lib/actions/services";

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
      const blob = (await onHfImageGenerate(e)) as Blob;

      // const blob = (await onImageGenerate(e)) as Blob;

      const { data = null } = (await generateImage({
        blob,
        fileName: file.name,
      })) as {
        data: SelectedImage;
      };

      if (data) {
        setSelectedImage(data);
        router.push("/generate");
      } else {
        toast({
          variant: "destructive",
          description: "Oops! Something went wrong.",
        });
      }

      if (inputFileRef.current) inputFileRef.current.value = "";
    } catch (error) {
      console.log("error", error);
      toast({
        variant: "destructive",
        description: (error as Error).message,
      });
    } finally {
      setGlobalLoader(false);
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        className={className}
        onClick={() =>
          session?.user ? inputFileRef?.current?.click() : toggleLogin()
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
