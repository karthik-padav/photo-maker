"use client";

import {
  CircleDashed,
  BoxSelect,
  Layers,
  Image as LImage,
  Square,
} from "lucide-react";
import { useAppProvider } from "@/lib/app-provider";
import { useSession, getCsrfToken } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  getBgStyles,
  getClientSideCookie,
  rembg,
  getImageStyle,
  myPhotoControlers,
  calcPercentage,
  calcPx,
  onDownload,
  getBorderStyles,
} from "@/lib/common";
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
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import Draggable from "react-draggable";
import { ControlerValue, SessionData } from "@/lib/interfaces";
import MyPhotoControler from "@/components/customize/MyPhotoControler";
import Border from "@/components/customize/Border";
import Background from "@/components/customize/Background";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Customize() {
  const { selectedImage, controlerValue, setControlerValue, toggleLogin } =
    useAppProvider();
  const [imageWrapperSize, setImageWrapperSize] = useState<number>(100);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession() as { data: SessionData | null };

  const [activeTab, setActiveTab] = useState<string>("MY_PHOTO");
  const [menu] = useState(() => [
    {
      label: "My Photo",
      code: "MY_PHOTO",
      icon: (
        <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full">
          <Image
            placeholder="blur"
            blurDataURL={constants.blurDataURL}
            src={selectedImage.imageURL}
            layout="fill"
            objectFit="cover"
            alt="profile pic"
            loading="lazy"
          />
        </div>
      ),
    },
    { label: "Border", code: "BORDER", icon: <Square className="h-6 w-6" /> },
    {
      label: "Background",
      code: "BACKGROUND",
      icon: <LImage className="h-6 w-6" />,
    },
  ]);

  function handleImageLoad() {
    if (imageWrapperRef?.current?.offsetWidth) {
      setImageWrapperSize(imageWrapperRef.current.offsetWidth);
    }
  }

  function handleDrop(e: any, ui: { x: number; y: number }) {
    setControlerValue({
      ...controlerValue,
      ["transform"]: {
        x: imageWrapperRef?.current?.offsetWidth
          ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.x)
          : 0,
        y: imageWrapperRef?.current?.offsetWidth
          ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.y)
          : 0,
      },
    });
  }

  const { transform, ...rest } = controlerValue;
  let imageStyle = getImageStyle(rest);
  let imageBgStyle = getBgStyles({
    controlerValue: controlerValue,
  });

  console.log(controlerValue, "controlerValue123");
  const borderRadius = controlerValue?.border?.value
    ? controlerValue.border.value
    : "";
  return (
    <main className="text-black body-font container">
      <div className="mb-10 flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="bg-background drop-shadow-2xl rounded-full p-6 mr-4 dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl"
            >
              <div
                className={`${controlerValue?.border?.value} h-6 w-6 border-dotted border-2 border-black mr-2 hover:border-white`}
              />
              {controlerValue?.border?.title}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {constants.borders.map((i) => (
              <DropdownMenuItem
                key={i.value}
                onClick={() => setControlerValue({ border: i })}
              >
                <div
                  className={`${i.value} h-6 w-6 border-dotted border-2 border-black mr-2`}
                />
                {i.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          className="bg-background drop-shadow-2xl rounded-full p-6 mr-4 dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl"
          onClick={() =>
            session?.user ? onDownload(imageWrapperRef.current) : toggleLogin()
          }
        >
          Download
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-2 rounded-md ">
          {menu.map((item) => (
            <Button
              key={item.code}
              variant="ghost"
              onClick={() => setActiveTab(item.code)}
              className={`w-full py-6 mb-2 justify-start ${
                activeTab === item.code
                  ? "bg-violet-500 text-white"
                  : "bg-background"
              } dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl`}
            >
              {item.icon}
              <span className="px-2">{item.label}</span>
            </Button>
          ))}
        </div>
        <div className="col-span-4 drop-shadow-2xl p-4 bg-background dark:text-white">
          {activeTab === "MY_PHOTO" && <MyPhotoControler />}
          {activeTab === "BORDER" && <Border />}
          {activeTab === "BACKGROUND" && <Background />}
        </div>
        <div className="col-span-6 bg-[url('/images/grid.svg')] outline-dashed outline-[#9C92AC20] drop-shadow-2xl p-8 bg-background">
          <div className="aspect-w-1 aspect-h-1">
            <div
              className={`outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25]`}
            >
              <div
                ref={imageWrapperRef}
                className={`relative w-full h-full overflow-hidden ${borderRadius}`}
              >
                <div
                  className={`_border absolute top-0 bottom-0 right-0 left-0 z-30 ${borderRadius}`}
                  style={getBorderStyles(controlerValue)}
                />
                <div
                  className={`_bg absolute top-0 bottom-0 right-0 left-0 z-20 ${borderRadius}`}
                  style={imageBgStyle}
                />
                <div
                  className={`_imageWrapper absolute top-0 bottom-0 right-0 left-0 z-50 ${borderRadius}`}
                >
                  <Draggable
                    defaultPosition={{
                      x: controlerValue?.transform?.x
                        ? calcPx(imageWrapperSize, controlerValue.transform.x)
                        : 0,
                      y: controlerValue?.transform?.y
                        ? calcPx(imageWrapperSize, controlerValue.transform.y)
                        : 0,
                    }}
                    onStop={handleDrop}
                    bounds={{
                      top: -(imageWrapperSize - 462 * (30 / 100)),
                      left: -(imageWrapperSize - 462 * (30 / 100)),
                      right: imageWrapperSize - 462 * (30 / 100),
                      bottom: imageWrapperSize - 462 * (30 / 100),
                    }}
                  >
                    <div className="relative h-full w-full">
                      <div className="absolute top-0 bottom-0 right-0 left-0 z-50" />
                      <Image
                        className="z-40"
                        style={imageStyle}
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        src={selectedImage.imageURL}
                        layout="fill"
                        objectFit="contain"
                        alt="profile pic"
                        loading="lazy"
                        onLoadingComplete={handleImageLoad}
                      />
                    </div>
                  </Draggable>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <div className="aspect-w-1 aspect-h-1 relative">
              <div className="w-full h-full bg-gray-100 overflow-hidden rounded-full">
                {selectedImage && (
                  <div className="aspect-w-1 aspect-h-1">
                    <div
                      className="w-full h-full bg-gray-100 overflow-hidden rounded-full"
                      style={imageBgStyle}
                      ref={imageWrapperRef}
                    >
                      <Draggable
                        defaultPosition={{
                          x: controlerValue?.transform?.x
                            ? calcPx(
                                imageWrapperSize,
                                controlerValue.transform.x
                              )
                            : 0,
                          y: controlerValue?.transform?.y
                            ? calcPx(
                                imageWrapperSize,
                                controlerValue.transform.y
                              )
                            : 0,
                        }}
                        onStop={handleDrop}
                        bounds={{
                          top: -(imageWrapperSize - 462 * (30 / 100)),
                          left: -(imageWrapperSize - 462 * (30 / 100)),
                          right: imageWrapperSize - 462 * (30 / 100),
                          bottom: imageWrapperSize - 462 * (30 / 100),
                        }}
                      >
                        <div className="relative h-full w-full">
                          <div className="absolute top-0 bottom-0 right-0 left-0 z-10" />
                          <Image
                            style={imageStyle}
                            placeholder="blur"
                            blurDataURL={constants.blurDataURL}
                            src={selectedImage.imageURL}
                            layout="fill"
                            objectFit="contain"
                            alt="profile pic"
                            loading="lazy"
                            onLoadingComplete={handleImageLoad}
                          />
                        </div>
                      </Draggable>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {Object.keys(controler).map((key: string) => {
              const data = controler[key];
              return (
                <div className="border-white drop-shadow-md pt-4" key={key}>
                  <p className="flex justify-between mb-1">
                    {data.label}
                    <span>
                      {data?.attr?.value || 0}
                      {data.valuePrefix}
                    </span>
                  </p>
                  <input
                    onChange={(e) =>
                      setLocalControlerValue((prev) => {
                        return { ...prev, [key]: e.target.value };
                      })
                    }
                    {...data.attr}
                  />
                </div>
              );
            })}

            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setControlerValue(localControlerValue);
                  setIsOpen(false);
                }}
                className="w-full border-white drop-shadow-2xl rounded-full p-6"
              >
                Save
              </Button>
            </div>
          </div>

          <div className="col-span-3 py-4">
            <div className="px-4">
              {tabs.map((i) => (
                <Button
                  key={i.code}
                  variant="outline"
                  onClick={() => setActiveTab(i.code)}
                  className={`${
                    activeTab === i.code ? "border-yellow-300" : ""
                  } drop-shadow-2xl rounded-full p-6 mr-4`}
                >
                  {i.title}
                </Button>
              ))}
            </div>
            <ScrollArea className="h-[70vh] w-full pt-4 px-4">
              {activeTab === "BORDER" && (
                <>
                  <ColorPicker
                    onClick={(obj: { [key: string]: string }) =>
                      setLocalControlerValue({
                        ...localControlerValue,
                        pngBorderColor: obj.color,
                      })
                    }
                  />
                </>
              )}
              {activeTab === "BG_COLOR" && (
                <ColorPicker
                  onClick={(obj: { [key: string]: string }) =>
                    setLocalControlerValue({
                      ...localControlerValue,
                      backgroundColor: {
                        type: obj.type,
                        color: obj.color,
                      },
                    })
                  }
                />
              )}
            </ScrollArea>
          </div>
        </div>
      </div> */}
    </main>
  );
}
