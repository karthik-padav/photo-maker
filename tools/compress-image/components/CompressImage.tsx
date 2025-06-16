"use client";

import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { SessionData } from "@/lib/interfaces";
import { cn } from "@/lib/utils";
import Dropzone from "@/components/dropzone";
import { uid } from "uid";
import imageCompression from "browser-image-compression";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import dynamic from "next/dynamic";

const Download = dynamic(
  () => import("lucide-react").then((mod) => mod.Download),
  {
    loading: () => <span>Loading...</span>,
  }
);

const LoaderCircle = dynamic(
  () => import("lucide-react").then((mod) => mod.LoaderCircle),
  {
    loading: () => <span>Loading...</span>,
  }
);

const MoveRight = dynamic(
  () => import("lucide-react").then((mod) => mod.MoveRight),
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

const Trash2 = dynamic(() => import("lucide-react").then((mod) => mod.Trash2), {
  loading: () => <span>Loading...</span>,
});

interface IImage {
  original: File;
  compressed: File;
}

export default function CompressImage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };
  const { toggleLogin } = useAppProvider();
  const { toast } = useToast();
  const [images, setImages] = useState<{ [key: string]: IImage }>({});
  const [loading, setLoading] = useState(false);

  function deleteImage(id: string) {
    setImages((prev) => {
      const newImages = { ...prev };
      delete newImages[id];
      return newImages;
    });
  }

  async function onImageChange(files) {
    if (!files) return;
    let _files = {};
    for (const file of files) {
      _files[uid(16)] = { original: file };
    }
    setImages(_files);
  }

  async function compressImage() {
    let _images = { ...images };
    let loaderToast;
    loaderToast = toast({
      title: "Compressing Image.",
      description:
        "This may take a few minutes depending on the image size. Thanks for your patience!",
      duration: Infinity,
    });
    try {
      let promises: Promise<File>[] = [];

      setLoading(true);
      for (const i in _images) {
        promises.push(
          imageCompression(images[i].original, {
            maxSizeMB: images[i].original.size / 1024 ** 2 / 2,
            useWebWorker: true,
          })
        );
      }
      const compressedFiles = await Promise.all(promises);
      for (const key in _images) {
        _images[key].compressed = compressedFiles.shift() as File;
      }

      setImages(_images);
    } catch (error) {
      console.error("Compression error:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something Went Wrong.",
        description: "There Was A Problem With Your Request.",
      });
    } finally {
      if (loaderToast) loaderToast.dismiss();
      setLoading(false);
      if (inputFileRef.current) inputFileRef.current.value = "";
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes >= 1024 ** 3) return (bytes / 1024 ** 3).toFixed(2) + " GB";
    else if (bytes >= 1024 ** 2) return (bytes / 1024 ** 2).toFixed(2) + " MB";
    else if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return bytes + " B";
  }

  const downloadImage = async () => {
    const zip = new JSZip();

    for (const key in images) {
      zip.file(images[key].compressed.name, images[key].compressed);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "download.zip");
  };

  const disableDownload = !Object.keys(images).length || loading;
  const hasCompressedImage = images[Object.keys(images)[0]]?.compressed;

  return (
    <>
      {Object.keys(images).length > 0 ? (
        <div className="md:max-h-[80vh] overflow-y-auto drop-shadow-xl bg-background border border-input p-2 md:p-4">
          {Object.keys(images).map((key) => {
            const image = images[key];
            const compressionPercent =
              ((image.original.size - image?.compressed?.size || 0) /
                image.original.size) *
              100;

            return (
              <div
                key={key}
                className="p-2 flex justify-between items-center border-b border-input"
              >
                <div className="flex justify-start">
                  <Image
                    alt={image.original.name}
                    src={URL.createObjectURL(image.original)}
                    priority
                    width={500}
                    height={500}
                    className="h-16 w-16 object-cover"
                  />
                  <div className="px-4">
                    <p className="line-clamp-1">{image.original.name}</p>
                    <p className="flex items-center text-sm text-muted-foreground">
                      <span>{formatFileSize(image.original.size)}</span>
                      {image?.compressed?.size && (
                        <>
                          <MoveRight className="mx-2" />
                          <span>{formatFileSize(image.compressed.size)}</span>
                          <span className="mx-2">
                            Your Image is now {compressionPercent.toFixed(1)}%
                            smaller!
                          </span>
                          <span className="text-violet-500">
                            {compressionPercent.toFixed(1)}% Saved
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  aria-label="Delete"
                  onClick={() => deleteImage(key)}
                  disabled={loading}
                  className={cn(
                    loading ? "cursor-not-allowed" : "cursor-pointer",
                    "p-4 mx-1 rounded-full hover:text-red-500 dark:text-white drop-shadow-2xl bg-transparent"
                  )}
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-[64vh]">
          <Dropzone
            onChange={onImageChange}
            loading={loading}
            requireLogin={true}
            session={session}
            toggleLogin={toggleLogin}
            description={`PNG, JPG or WEBP`}
            inputProps={{
              accept: "image/*",
              multiple: true,
              type: "file",
            }}
          />
        </div>
      )}

      <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4 mt-4 flex justify-between items-center">
        {hasCompressedImage ? (
          <Button
            aria-label="Download"
            onClick={downloadImage}
            variant="outline"
            className={cn(
              "hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:mr-2 group"
            )}
            disabled={disableDownload}
          >
            <span className={`flex ${loading ? "opacity-0" : ""}`}>
              Download Image
              <Download className="ml-2 w-5 h-5 text-violet-500 group-hover:text-white" />
            </span>
            {loading && (
              <LoaderCircle className="m-auto h-8 w-8 text-violet-500 animate-spin absolute left-0 right-0 bottom-0 top-0" />
            )}
          </Button>
        ) : (
          <Button
            onClick={compressImage}
            aria-label="Compress Image"
            variant="outline"
            className={cn(
              disableDownload ? "cursor-not-allowed" : "cursor-pointer",
              "relative hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:mr-2 group"
            )}
            disabled={disableDownload}
          >
            <span className={`flex ${loading ? "opacity-0" : ""}`}>
              Compress Image
              <Download className="ml-2 w-5 h-5 text-violet-500 group-hover:text-white" />
            </span>
            {loading && (
              <LoaderCircle className="m-auto h-8 w-8 text-violet-500 animate-spin absolute left-0 right-0 bottom-0 top-0" />
            )}
          </Button>
        )}
        <Button
          onClick={() => setImages({})}
          aria-label="Re-upload"
          variant="outline"
          className={cn(
            "hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:ml-2"
          )}
          disabled={disableDownload}
        >
          Re-upload
          <RotateCcw className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </>
  );
}
