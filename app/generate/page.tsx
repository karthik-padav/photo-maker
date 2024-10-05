"use client";

import { CircleDashed, BoxSelect, Download } from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession, getCsrfToken } from "next-auth/react";
import { useEffect, useRef } from "react";
import { getBgStyles, getClientSideCookie, rembg } from "@/lib/common";
import { uid } from "uid";
import Image from "next/image";
import DragAndDrop from "@/components/dragAndDrop";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";
import DownloadImage from "@/components/downloadImage";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createControler } from "@/lib/actions/services";

export default function Generate() {
  const router = useRouter();
  const { selectedImage, controlerValue, setControlerValue } = useAppProvider();
  const imageWrapperRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const session = useSession();
  if (!selectedImage || !session?.data) router.push("/");

  function handleRedirect(item: { id: string; bgImage?: string }) {
    if (item?.bgImage)
      setControlerValue({ ...controlerValue, bgImage: item.bgImage });
    router.push("/customize");
  }

  const borderRadius = controlerValue?.border?.value
    ? controlerValue.border.value
    : "";
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
                      <div
                        className={`border-white border-4 drop-shadow-2xl ${borderRadius}`}
                      >
                        <DownloadImage
                          disabled={true}
                          image={selectedImage}
                          controler={{
                            bgImage: item.bgImage,
                            border: controlerValue?.border,
                            bgSize: "100",
                          }}
                        />
                      </div>
                      {/* <div
                        className={`h-full w-full overflow-hidden ${borderRadius}`}
                        style={imageBgStyle}
                      >
                        <Image
                          // style={imageStyle}
                          placeholder="blur"
                          blurDataURL={constants.blurDataURL}
                          src={selectedImage.imageURL}
                          layout="fill"
                          objectFit="contain"
                          alt="profile pic"
                          loading="lazy"
                          // onLoadingComplete={handleImageLoad}
                        />
                      </div> */}
                    </div>
                    <div className="text-center -mt-7">
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
