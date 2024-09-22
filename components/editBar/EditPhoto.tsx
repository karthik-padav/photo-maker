import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppProvider } from "../../lib/app-provider";
import constants from "@/lib/constants";
import {
  calcPercentage,
  calcPx,
  myPhotoControlers,
  extractValues,
  getBgStyles,
  getImageStyle,
} from "@/lib/common";
import Draggable from "react-draggable";
import { ScrollArea } from "../ui/scroll-area";
import ColorPicker from "../colorPicker";
import { ControlerValue } from "@/lib/interfaces";

const tabs = [
  { title: "Boder", code: "BORDER" },
  { title: "Background Color", code: "BG_COLOR" },
];

export default function EditPhoto() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { selectedImage, controlerValue, setControlerValue } = useAppProvider();
  const [localControlerValue, setLocalControlerValue] =
    useState<ControlerValue>(controlerValue);
  const [imageWrapperSize, setImageWrapperSize] = useState<number>(100);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].code);

  const controler: any = myPhotoControlers(localControlerValue);

  function handleImageLoad() {
    if (imageWrapperRef?.current?.offsetWidth) {
      setImageWrapperSize(imageWrapperRef.current.offsetWidth);
    }
  }

  function handleDrop(e: any, ui: { x: number; y: number }) {
    setLocalControlerValue((prev) => {
      return {
        ...prev,
        ["transform"]: {
          x: imageWrapperRef?.current?.offsetWidth
            ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.x)
            : 0,
          y: imageWrapperRef?.current?.offsetWidth
            ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.y)
            : 0,
        },
      };
    });
  }
  const { transform, ...rest } = localControlerValue;
  let imageStyle = getImageStyle(rest);
  let imageBgStyle = getBgStyles({
    controlerValue: localControlerValue,
  });

  return (
    <>
      <Button
        variant="outline"
        className={`border-white drop-shadow-2xl rounded-full p-6 mr-4`}
        onClick={() => setIsOpen(true)}
      >
        {selectedImage && (
          <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full border-1 border-black mr-2 drop-shadow-md">
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
        )}
        Edit Photo
      </Button>

      {isOpen && (
        <div
          className="fixed bg-black bg-opacity-85 bottom-0 left-0 right-0 top-0 z-50"
          onClick={(e) => e.target === e.currentTarget && setIsOpen(false)}
        >
          <div className="fixed bg-white bottom-0 left-0 right-0 z-50 px-4 pt-4">
            <div className="flex-1 space-y-6 py-1" />
            <div className="mx-auto w-full max-w-6xl">
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
                      <div
                        className="border-white drop-shadow-md pt-4"
                        key={key}
                      >
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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
