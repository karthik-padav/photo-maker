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
import { useAppProvider } from "../app-provider";
import constants from "@/lib/constants";
import { editImageControlers } from "@/lib/common";
import Draggable from "react-draggable";

const style_1 = {
  "--stroke-pos": "3px",
  "--stroke-neg": "-3px",
  "--stroke-color": "rgba(0, 255, 0, 0.2)",
  filter:
    "drop-shadow(var(--stroke-pos) 0 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(0 var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(0 var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(var(--stroke-pos) var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(var(--stroke-pos) var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) var(--stroke-neg) 0 var(--stroke-color))",
};

const style_2 = {
  filter: "drop-shadow(0 0 14px rgba(0, 0, 0, 1))",
};

const extractValues = (input: string) => {
  const regex = /translate\(([-\d.]+)%, ([-\d.]+)%\)/;
  const matches = input?.match(regex);
  if (matches) {
    return [parseFloat(matches[1]), parseFloat(matches[2])];
  }
  return [];
};

export default function EditPhoto() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { currentImage, controlerValue, setControlerValue } = useAppProvider();
  const [localControlerValue, setLocalControlerValue] = useState<{
    [key: string]: string;
  }>({
    rotate: controlerValue?.rotate || 0,
    scale: controlerValue?.scale || 1,
    transform: controlerValue?.transform,
  });
  const [imageWrapperSize, setImageWrapperSize] = useState<number>(100);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  const controler: any = editImageControlers(controlerValue);

  function handleImageLoad() {
    if (imageWrapperRef?.current?.offsetWidth) {
      setImageWrapperSize(imageWrapperRef.current.offsetWidth);
    }
  }

  function handleDrop(e: any, ui: { x: number; y: number }) {
    setLocalControlerValue((prev) => {
      return {
        ...prev,
        ["transform"]: `translate(${(ui.x / imageWrapperSize) * 100}%, ${
          (ui.y / imageWrapperSize) * 100
        }%)`,
      };
    });
  }

  let imageStyle: { [key: string]: string } = {};
  if (localControlerValue?.rotate)
    imageStyle["rotate"] = `${localControlerValue.rotate}deg`;
  if (localControlerValue?.scale)
    imageStyle["scale"] = `${localControlerValue.scale}`;

  return (
    <>
      <Button
        variant="outline"
        className={`border-white drop-shadow-2xl rounded-full p-6 mr-4`}
        onClick={() => setIsOpen(true)}
      >
        {currentImage && (
          <div className="h-6 w-6 bg-gray-100 overflow-hidden relative rounded-full border-1 border-black mr-2 drop-shadow-md">
            <Image
              placeholder="blur"
              blurDataURL={constants.blurDataURL}
              src={currentImage.imageURL}
              layout="fill"
              objectFit="cover"
              alt="profile pic"
              loading="lazy"
            />
          </div>
        )}
        Edit Photo
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>

          {currentImage && (
            <>
              <div className="w-full min-h-96 bg-gray-100 relative overflow-hidden rounded-full">
                <Draggable
                  defaultPosition={{
                    x:
                      (extractValues(controlerValue?.transform)?.[0] *
                        imageWrapperSize) /
                        100 || 0,
                    y:
                      (extractValues(controlerValue?.transform)?.[1] *
                        imageWrapperSize) /
                        100 || 0,
                  }}
                  onStop={handleDrop}
                  bounds={{
                    top: -(imageWrapperSize - 462 * (30 / 100)),
                    left: -(imageWrapperSize - 462 * (30 / 100)),
                    right: imageWrapperSize - 462 * (30 / 100),
                    bottom: imageWrapperSize - 462 * (30 / 100),
                  }}
                >
                  <div
                    className="w-full h-full relative cursor-move outline-2 outline-dashed outline-[#9C92AC20] hover:outline-[#9C92AC50] bg-[#9C92AC15] hover:bg-[#9C92AC25]"
                    style={{ height: imageWrapperSize }}
                    ref={imageWrapperRef}
                  >
                    <div className="absolute top-0 bottom-0 right-0 left-0 z-10" />
                    <div className="relative h-full w-full">
                      <Image
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        src={currentImage.imageURL}
                        layout="fill"
                        objectFit="cover"
                        alt="profile pic"
                        loading="lazy"
                        style={{ ...style_2, ...imageStyle }}
                        onLoadingComplete={handleImageLoad}
                      />
                    </div>
                  </div>
                </Draggable>
              </div>
            </>
          )}

          {Object.keys(controler).map((key: string) => {
            const data = controler[key];
            return (
              <div className="border-white drop-shadow-md" key={key}>
                <p className="flex justify-between mb-1">
                  {data.label}
                  <span>
                    {localControlerValue?.[key] || 0}
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
                  value={localControlerValue?.[key] || 0}
                />
              </div>
            );
          })}

          <Button
            variant="outline"
            className={`border-white drop-shadow-2xl rounded-full p-6`}
            onClick={() => {
              setControlerValue({ ...localControlerValue });
              setIsOpen(false);
            }}
          >
            Save Photo
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
