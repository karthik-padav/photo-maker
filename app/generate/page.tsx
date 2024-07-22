"use client";

import { CircleDashed, BoxSelect, Download } from "lucide-react";
import { useAppProvider } from "@/components/app-provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { client } from "@gradio/client";
import { getImageStyle, rembg } from "@/lib/common";
import { useUploadThing } from "@/lib/uploadthing";
import { uid } from "uid";
import { fetchImages, updateImage } from "@/lib/actions/image.actions";
import Image from "next/image";
import DragAndDrop from "@/components/dragAndDrop";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

interface SessionData {
  user: { email: string; photos: string[] };
}

export default function Generate() {
  const { setCurrentImage, currentImage, controlerValue } = useAppProvider();
  const imageWrapperRef = useRef<{
    [key: string]: { [key: string]: HTMLDivElement };
  }>({ sideList: {}, main: {} });
  const { data: session } = useSession() as { data: SessionData | null };
  const [loader, setLoader] = useState<Boolean>(false);
  const [downloadableImageSize, setDownloadableImageSize] = useState<number>();
  const [myImageSize, setMyImageSize] = useState<number>();
  const { startUpload } = useUploadThing("imageUploader");
  const [myImages, setMyImages] = useState<{
    loader: boolean;
    data: { imageURL: string; email: string; _id: string }[];
  }>(() => {
    return { loader: true, data: [] };
  });

  console.log(imageWrapperRef, "imageWrapperRef123");

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
            {[...myImages.data].map((i) => (
              <div
                key={i._id}
                className="bg-red-100 rounded-full w-full relative overflow-hidden border-white border-6 drop-shadow-md"
                ref={(e: HTMLDivElement) => {
                  imageWrapperRef.current["sideList"][i._id] = e;
                }}
                style={{ height: myImageSize }}
                onClick={() => setCurrentImage(i)}
              >
                <Image
                  placeholder="blur"
                  blurDataURL={constants.blurDataURL}
                  src={i.imageURL}
                  loading="lazy"
                  layout="fill"
                  objectFit="cover"
                  className="hover:scale-125 transition-all duration-500 cursor-pointer"
                  alt="profile pic"
                  onLoadingComplete={() => {
                    const height =
                      imageWrapperRef?.current?.["sideList"]?.[i._id]
                        ?.offsetWidth;
                    if (height && !myImageSize) {
                      setMyImageSize(height);
                    }
                  }}
                />
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
                {constants.pngBgCollections.map((item) => {
                  let imageStyle = getImageStyle(controlerValue);
                  return (
                    <div
                      key={item.id}
                      className={`${controlerValue.border.value} overflow-hidden relative border-white border-8 hover:drop-shadow-md transition duration-300`}
                    >
                      <Button
                        onClick={() => onDownload(item.id)}
                        variant="ghost"
                        className="hover:bg-black hover:bg-opacity-50 z-50 absolute w-full h-full transition-opacity duration-300 group"
                      >
                        <Download className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white" />
                      </Button>
                      <div
                        className={`${controlerValue.border.value} w-full relative overflow-hidden`}
                        ref={(e: HTMLDivElement) => {
                          imageWrapperRef.current["main"][item.id] = e;
                        }}
                        style={{
                          height: downloadableImageSize,
                        }}
                      >
                        <Image
                          placeholder="blur"
                          blurDataURL={constants.blurDataURL}
                          loading="lazy"
                          src={currentImage.imageURL}
                          layout="fill"
                          objectFit="cover"
                          className=""
                          alt="profile pic"
                          style={imageStyle}
                          onLoadingComplete={() => {
                            const height =
                              imageWrapperRef?.current?.["main"]?.[item.id]
                                ?.offsetWidth;
                            if (height && !downloadableImageSize) {
                              setDownloadableImageSize(height);
                            }
                          }}
                        />
                      </div>
                    </div>
                  );
                })}

                {constants.gradientColorCollection.map((item) => {
                  let imageStyle = getImageStyle(controlerValue);
                  return (
                    <div
                      key={item.id}
                      className={`${controlerValue.border.value} overflow-hidden relative border-white border-8 hover:drop-shadow-md transition duration-300`}
                    >
                      <Button
                        onClick={() => onDownload(item.id)}
                        variant="ghost"
                        className="hover:bg-black hover:bg-opacity-50 z-50 absolute w-full h-full transition-opacity duration-300 group"
                      >
                        <Download className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white" />
                      </Button>
                      <div
                        className={`${controlerValue.border.value} w-full relative overflow-hidden`}
                        ref={(e: HTMLDivElement) => {
                          imageWrapperRef.current["main"][item.id] = e;
                        }}
                        style={{
                          height: downloadableImageSize,
                          background: item.color,
                        }}
                      >
                        <Image
                          placeholder="blur"
                          blurDataURL={constants.blurDataURL}
                          loading="lazy"
                          src={currentImage.imageURL}
                          layout="fill"
                          objectFit="cover"
                          className=""
                          alt="profile pic"
                          style={imageStyle}
                          onLoadingComplete={() => {
                            const height =
                              imageWrapperRef?.current?.["main"]?.[item.id]
                                ?.offsetWidth;
                            if (height && !downloadableImageSize) {
                              setDownloadableImageSize(height);
                            }
                          }}
                        />
                      </div>
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
    </main>
  );
}
