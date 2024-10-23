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
  const { controlerValue, setControlerValue } = useAppProvider();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const controler: any = bgControlers(controlerValue);

  function handleColor(obj: { [key: string]: string }) {
    let _controlerValue = { ...controlerValue };
    if (_controlerValue?.bgImage) {
      _controlerValue.bgImage = "null";
      _controlerValue.bgSize = "null";
    }
    setControlerValue({
      ..._controlerValue,
      backgroundColor: { type: obj.type, color: obj.color },
    });
  }

  function handleBg(value: string) {
    let _controlerValue = { ...controlerValue };
    if (_controlerValue?.backgroundColor)
      _controlerValue.backgroundColor = null;
    setControlerValue({
      ..._controlerValue,
      bgImage: value,
      bgSize: controler.bgSize.attr.value,
    });
    setIsOpen(false);
  }

  return (
    <>
      <p className="pb-1">Background Image</p>
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger
          className={`bg-background p-4 dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl mb-2 rounded-md`}
        >
          <LImage />
        </DrawerTrigger>

        <DrawerContent>
          <div className="container">
            <DrawerHeader className="flex justify-between items-center">
              <DrawerTitle>Select Background Image</DrawerTitle>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
            </DrawerHeader>
            <ScrollArea className="h-[70vh] w-full pt-4 px-4">
              <div className="grid grid-cols-3 md:grid-cols-8 gap-4">
                {constants.pngBgCollections.map((item) => {
                  if (item?.bgImage)
                    return (
                      <div
                        key={item.id}
                        className="aspect-w-1 aspect-h-1 relative hover:cursor-pointer bg-white"
                        onClick={() => handleBg(item.bgImage)}
                      >
                        <Image
                          src={item.bgImage}
                          layout="fill"
                          objectFit="cover"
                          alt="profile pic"
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

      {controlerValue?.bgImage &&
        Object.keys(controler).map((key: string) => {
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
                  setControlerValue({
                    ...controlerValue,
                    [key]: e.target.value,
                  })
                }
                {...data.attr}
              />
            </div>
          );
        })}
      <ColorPicker cols="12" onClick={handleColor} />
    </>
  );
}
