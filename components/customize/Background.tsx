import { bgControlers } from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import constants from "@/lib/constants";
import { Image as LImage } from "lucide-react";
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

export default function Background() {
  const { controlerValue, setControlerValue, bgImages } = useAppProvider();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const controler: any = bgControlers(controlerValue);

  function handleColor(obj: { [key: string]: string }) {
    let _controlerValue = { ...controlerValue };
    if (_controlerValue?.backgroundImagePath) {
      _controlerValue.backgroundImagePath = "";
      _controlerValue.backgroundScale = "1";
    }
    setControlerValue({
      ..._controlerValue,
      backgroundColorType: obj.type,
      backgroundColor: obj.color,
    });
  }

  function handleBg(value: string) {
    let _controlerValue = { ...controlerValue };
    if (_controlerValue?.backgroundColor) {
      _controlerValue.backgroundColor = "";
      _controlerValue.backgroundColorType = "";
    }
    setControlerValue({
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
          className={`bg-background p-2 md:p-4 dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl mb-2 rounded-md`}
        >
          <LImage />
        </DrawerTrigger>

        <DrawerContent>
          <div className="px-4 md:container ">
            <DrawerHeader className="flex justify-between items-center">
              <DrawerTitle className="">Background Images</DrawerTitle>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
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
                {bgImages.map((item) => {
                  if (item?.key)
                    return (
                      <div
                        key={item.key}
                        className="aspect-w-1 aspect-h-1 relative hover:cursor-pointer bg-white"
                        onClick={() => handleBg(item.key)}
                      >
                        <Image
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.key}`}
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
                  return null;
                })}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </Drawer>

      {Object.keys(controler).map((key: string) => {
        const data = controler[key];
        return (
          <div className="border-white drop-shadow-md md:pt-4 pt-2" key={key}>
            <p className="flex justify-between mb-1">
              {data.label}
              <span>
                {data?.attr?.value || 0}
                {data.valuePrefix}
              </span>
            </p>
            <input
              onChange={(e) =>
                setControlerValue({
                  [key]: e.target.value,
                })
              }
              {...data.attr}
            />
          </div>
        );
      })}
      <ColorPicker
        onClick={handleColor}
        colorList={[
          {
            label: "Solid",
            list: constants.solidColorCollection,
            type: "bg",
          },
          {
            label: "Gradients",
            list: constants.gradientColorCollection,
            type: "bgg",
          },
        ]}
      />
    </>
  );
}
