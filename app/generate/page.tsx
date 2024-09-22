"use client";

import { CircleDashed, BoxSelect, Download } from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession, getCsrfToken } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { getBgStyles, getClientSideCookie, rembg } from "@/lib/common";
import { useUploadThing } from "@/lib/uploadthing";
import { uid } from "uid";
import Image from "next/image";
import DragAndDrop from "@/components/dragAndDrop";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import DownloadImage from "@/components/downloadImage";
import ColorPicker from "@/components/customize";
import { updateControler } from "@/lib/actions/server.action";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SessionData {
  user: { email: string; photos: string[] };
  accessToken: string;
}

export default function Generate() {
  const router = useRouter();
  const { setSelectedImage, selectedImage, controlerValue, setControlerValue } =
    useAppProvider();
  const imageWrapperRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [customImage, setCustomImage] = useState<{
    id: string;
    bgImage?: string;
  } | null>(null);

  console.log(selectedImage, "currentImage123");
  async function onDownload(id: string) {
    if (!imageWrapperRef?.current?.[id]) return;
    toPng(imageWrapperRef.current[id], {
      cacheBust: true,
      quality: 1,
      pixelRatio: 5,
    })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "my-image-name.png";
        link.href = dataUrl;
        link.click();
        if (selectedImage?._id)
          updateControler({
            controler: controlerValue,
            controlerKey: "123321",
            imageId: selectedImage._id,
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleRedirect(item: { id: string; bgImage?: string }) {
    if (item?.bgImage)
      setControlerValue({ ...controlerValue, bgImage: item.bgImage });
    router.push("/customize");
  }

  return (
    <main className="text-black body-font container">
      {selectedImage && (
        <>
          <div className="mb-12 flex">
            <EditBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-12">
            {constants.pngBgCollections.map(
              (item: { id: string; bgImage?: string }) => {
                let imageBgStyle = getBgStyles({
                  item,
                  controlerValue,
                });
                return (
                  <div key={item.id}>
                    <div
                      className="aspect-w-1 aspect-h-1 relative"
                      ref={(e: HTMLDivElement) => {
                        if (imageWrapperRef.current) {
                          imageWrapperRef.current[item.id] = e;
                        }
                      }}
                    >
                      <DownloadImage
                        className="border-white border-4 drop-shadow-2xl"
                        selectedImage={selectedImage}
                        imageBgStyle={imageBgStyle}
                        imageData={item}
                        controlerValue={controlerValue}
                      />
                    </div>
                    <div className="text-center -mt-4">
                      {/* <Button
                        onClick={() => onDownload(item.id)}
                        variant="outline"
                        className="border-white drop-shadow-2xl rounded-full p-5 border-4 border-violet-100"
                      >
                        Download
                      </Button> */}
                      <Button
                        onClick={() => handleRedirect(item)}
                        className="drop-shadow-2xl rounded-full py-4 px-6 bg-violet-500 hover:bg-violet-500 text-white"
                      >
                        Customize
                      </Button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </>
      )}
      {/* <ColorPicker
        customImage={customImage}
        onClose={() => setCustomImage(null)}
      /> */}
    </main>
  );
}
