import constants from "@/lib/constants";
import { ScrollArea } from "../ui/scroll-area";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { useState } from "react";
import ColorPicker from "../colorPicker";
import Image from "next/image";
import { ControlerValue } from "@/lib/interfaces";
import { Slider } from "../ui/slider";
import { bgControlers } from "@/tools/profile-picture-maker/components/utils/common";
import dynamic from "next/dynamic";

const LImage = dynamic(() => import("lucide-react").then((mod) => mod.Image), {
  loading: () => <span>Loading...</span>,
});

export default function Background({
  controler = {},
  disabled = false,
  updateControler,
  bgImages = [],
}: {
  controler?: ControlerValue;
  disabled?: boolean;
  updateControler: (data) => void;
  bgImages: { key: string; url: string }[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const _controler: any = bgControlers();

  function handleColor(obj: { [key: string]: string }) {
    let _controlerValue = { ...controler };
    if (_controlerValue?.backgroundImagePath) {
      _controlerValue.backgroundImagePath = "";
      _controlerValue.backgroundScale = "1";
    }
    updateControler({
      ..._controlerValue,
      backgroundColorType: obj.type,
      backgroundColor: obj.color,
    });
  }

  function handleBg(value: string) {
    let _controlerValue = { ...controler };
    if (_controlerValue?.backgroundColor) {
      _controlerValue.backgroundColor = "";
      _controlerValue.backgroundColorType = "";
    }
    updateControler({
      ..._controlerValue,
      backgroundImagePath: value,
    });
    setIsOpen(false);
  }
  return (
    <>
      <p className="pb-1 md:pt-4 pt-2">Background Image</p>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger
          disabled={disabled}
          className={`bg-background p-2 md:p-4 dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl mb-2 rounded-md disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <LImage />
        </DrawerTrigger>

        <DrawerContent>
          <div className="px-4 md:container ">
            <DrawerHeader className="flex justify-between items-center">
              <DrawerTitle className="">Background Images</DrawerTitle>
              <Button
                aria-label="Cancel"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
            </DrawerHeader>
            <ScrollArea className="h-[70vh] w-full">
              <div className="grid grid-cols-3 md:grid-cols-8 gap-4">
                <div
                  className="aspect-w-1 aspect-h-1 relative hover:cursor-pointer bg-white border-2 border-dashed border-[#9C92AC20]"
                  onClick={() => handleBg("")}
                >
                  <p className="flex justify-center items-center">None</p>
                </div>
                {Array.from({ length: 65 }, (_, i) => i + 1).map((item) => {
                  const url = `${item}.webp`;
                  return (
                    <div
                      key={item}
                      className="aspect-w-1 aspect-h-1 relative hover:cursor-pointer bg-white"
                      onClick={() => handleBg(url)}
                    >
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${url}`}
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                        alt="Background Picture"
                        loading="lazy"
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>

      {Object.keys(_controler).map((key: string) => {
        const data = _controler[key];
        return (
          <div className="border-white drop-shadow-md md:pt-4 pt-2" key={key}>
            <label
              htmlFor={data.attr.name}
              className="flex justify-between mb-1"
            >
              {data.label}
              <span>
                {controler[data.attr.name] || 0}
                {data.postfix}
              </span>
            </label>

            <Slider
              id={data.attr.name}
              {...data.attr}
              defaultValue={[controler[data.attr.name]]}
              value={[controler[data.attr.name]]}
              onValueChange={(value) =>
                updateControler({ [data.attr.name]: value[0] })
              }
              disabled={disabled}
              aria-label={data.label}
            />
          </div>
        );
      })}
      <ColorPicker
        onClick={handleColor}
        colorList={[
          {
            label: "Solid",
            code: "SOLID",
            list: constants.solidColorCollection,
            type: "bg",
          },
          {
            label: "Gradients",
            code: "GRADIENTS",
            list: constants.gradientColorCollection,
            type: "bgg",
          },
        ]}
      />
    </>
  );
}
