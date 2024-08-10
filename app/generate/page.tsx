"use client";

import { CircleDashed, BoxSelect, Download } from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession, getCsrfToken } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { getImageBgStyle, getClientSideCookie, rembg } from "@/lib/common";
import { useUploadThing } from "@/lib/uploadthing";
import { uid } from "uid";
import { fetchImages, updateImage } from "@/lib/actions/image.actions";
import Image from "next/image";
import DragAndDrop from "@/components/dragAndDrop";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import DownloadImage from "@/components/downloadImage";
import ColorPicker from "@/components/customize";

interface SessionData {
  user: { email: string; photos: string[] };
  accessToken: string;
}

export default function Generate() {
  const { setCurrentImage, currentImage, controlerValue, setControlerValue } =
    useAppProvider();
  const imageWrapperRef = useRef<{
    [key: string]: { [key: string]: HTMLDivElement };
  }>({ sideList: {}, main: {} });
  const [customImage, setCustomImage] = useState<{
    id: string;
    url?: string;
  } | null>(null);

  async function onDownload(id: string) {
    if (!imageWrapperRef?.current["main"]?.[id]) return;
    console.log(imageWrapperRef?.current["main"], id);
    toPng(imageWrapperRef.current["main"][id], {
      cacheBust: true,
      quality: 1,
      pixelRatio: 5,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <main className="text-black body-font container">
      {currentImage && (
        <>
          <div className="mb-12 flex">
            <EditBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-12">
            {[
              ...constants.pngBgCollections,
              ...constants.pngBgCollections,
              ...constants.pngBgCollections,
            ].map((item: { id: string; url?: string }) => {
              let imageBgStyle = getImageBgStyle({
                item,
                controlerValue,
              });
              return (
                <div key={item.id}>
                  <div className="aspect-w-1 aspect-h-1 relative">
                    <DownloadImage
                      className="border-white border-8 hover:drop-shadow-md"
                      selectedImage={currentImage}
                      imageBgStyle={imageBgStyle}
                      assignRef={(e: HTMLDivElement) => {
                        imageWrapperRef.current["main"][item.id] = e;
                      }}
                      imageData={item}
                      controlerValue={controlerValue}
                    />
                  </div>
                  <div className="text-center -mt-10">
                    <Button
                      onClick={() => onDownload(item.id)}
                      variant="outline"
                      className="border-white drop-shadow-2xl rounded-full p-5 border-4 border-red-100"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      <ColorPicker
        customImage={customImage}
        onClose={() => setCustomImage(null)}
      />
    </main>
  );
}
