"use client";

import { CircleDashed, BoxSelect, Download } from "lucide-react";
import { useAppProvider } from "@/components/app-provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { client } from "@gradio/client";
import { rembg, getImageBgStyle } from "@/lib/common";
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
}

export default function Generate() {
  const { setCurrentImage, currentImage, controlerValue, setControlerValue } =
    useAppProvider();
  const imageWrapperRef = useRef<{
    [key: string]: { [key: string]: HTMLDivElement };
  }>({ sideList: {}, main: {} });
  const { data: session } = useSession() as { data: SessionData | null };
  const [loader, setLoader] = useState<boolean>(false);
  const { startUpload } = useUploadThing("imageUploader");
  const [myImages, setMyImages] = useState<{
    loader: boolean;
    data: { imageURL: string; email: string; _id: string }[];
  }>(() => {
    return { loader: true, data: [] };
  });
  const [customImage, setCustomImage] = useState<{
    id: string;
    url?: string;
  } | null>(null);

  useEffect(() => {
    getImages();
  }, []);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    let file: File | null = e?.target?.files?.[0] || null;
    if (file) {
      let blob = new Blob([file], { type: file.type });
      setLoader(true);
      try {
        blob = await rembg(blob);
        file = new File([blob], `${uid(16)}.png`, { type: "image/png" });
        const imgRes = await startUpload([file]);
        if (session?.user?.email && imgRes?.[0]?.url) {
          updateImage({
            imageURL: imgRes[0].url,
            email: session.user.email,
          });
        }
      } catch (error) {
        console.log(error);
      }
      setLoader(false);
    }
  }

  async function getImages() {
    if (session?.user?.photos?.length) {
      try {
        const resp = await fetchImages({ imageIds: session.user.photos });
        setMyImages({ loader: false, data: resp });
      } catch (error) {
        console.log(error);
        setMyImages({ loader: false, data: [] });
      }
    }
  }

  async function onDownload(id: string) {
    if (!imageWrapperRef?.current["main"]?.[id]) return;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-0 md:gap-2">
        <div className="col-span-1 p-4 rounded-md mb-4 md:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...myImages.data].map((item) => (
              <div key={item._id} className="aspect-w-1 aspect-h-1 relative">
                <div
                  className={`rounded-full w-full h-full overflow-hidden border-white border-4 drop-shadow-md transition duration-300`}
                  onClick={() => setCurrentImage(item)}
                  ref={(e: HTMLDivElement) => {
                    imageWrapperRef.current["sideList"][item._id] = e;
                  }}
                >
                  <Image
                    placeholder="blur"
                    blurDataURL={constants.blurDataURL}
                    src={item.imageURL}
                    loading="lazy"
                    layout="fill"
                    objectFit="cover"
                    className="hover:scale-125 transition-all duration-500 cursor-pointer"
                    alt="profile pic"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3 p-4 rounded-md mb-4 md:mb-0">
          {currentImage ? (
            <>
              <div className="mb-12">
                <EditBar />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-12">
                {[
                  ...constants.pngBgCollections,
                  ...constants.pngBgCollections,
                  ...constants.pngBgCollections,
                  ...constants.pngBgCollections,
                ].map((item: { id: string; url?: string }) => {
                  let imageBgStyle = getImageBgStyle({
                    item,
                    controlerValue,
                  });

                  return (
                    <div
                      key={item.id}
                      className="aspect-w-1 aspect-h-1 relative"
                    >
                      <DownloadImage
                        selectedImage={currentImage}
                        imageBgStyle={imageBgStyle}
                        onDownload={onDownload}
                        assignRef={(e: HTMLDivElement) => {
                          imageWrapperRef.current["main"][item.id] = e;
                        }}
                        imageData={item}
                        controlerValue={controlerValue}
                      />

                      <Button onClick={() => setCustomImage(item)}>
                        Border
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <DragAndDrop handleChange={handleFileChange} loader={loader} />
            </div>
          )}
        </div>
      </div>
      <ColorPicker
        customImage={customImage}
        onClose={() => setCustomImage(null)}
      />
    </main>
  );
}
