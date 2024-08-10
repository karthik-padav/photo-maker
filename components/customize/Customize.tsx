import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DownloadImage from "../downloadImage";
import { getImageBgStyle } from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import constants from "@/lib/constants";
import { ScrollArea } from "../ui/scroll-area";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ControlerValue } from "@/lib/interfaces";
import { useState } from "react";
import ColorPicker from "../colorPicker";

const tabs = [
  { title: "Boder", code: "BORDER" },
  { title: "Background Color", code: "BG_COLOR" },
];

export default function Customize({
  customImage,
  onClose,
}: {
  onClose: () => void;
  customImage: {
    id: string;
    url?: string;
  } | null;
}) {
  const { setCurrentImage, currentImage, controlerValue, setControlerValue } =
    useAppProvider();
  const [activeTab, setActiveTab] = useState<string>(tabs[0].code);
  const [localControlerValue, setLocalControlerValue] =
    useState<ControlerValue>(controlerValue);

  let imageBgStyle = getImageBgStyle({
    item: customImage,
    controlerValue: localControlerValue,
  });

  function onModalClose() {
    onClose();
    setLocalControlerValue(controlerValue);
    setActiveTab(tabs[0].code);
  }

  return (
    <Drawer
      open={!!customImage}
      onOpenChange={(value) => {
        if (value !== !!customImage) {
          onModalClose();
        }
      }}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-4xl">
          <DrawerHeader>
            <DrawerTitle className="text-center mb-4">
              Customize Photo
            </DrawerTitle>
          </DrawerHeader>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <div className="col-span-1">
              <div className="mx-auto w-full">
                <div className="aspect-w-1 aspect-h-1 relative">
                  {currentImage && (
                    <DownloadImage
                      className="drop-shadow-md border-white border-8"
                      imageBgStyle={imageBgStyle}
                      selectedImage={currentImage}
                      controlerValue={localControlerValue}
                    />
                  )}
                </div>
                <div className="text-center mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setControlerValue(localControlerValue);
                      onModalClose();
                    }}
                    className="w-full border-white drop-shadow-2xl rounded-full p-6"
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
            <div className="col-span-3 py-4">
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
              <div className="">
                <ScrollArea className="h-[70vh] w-full p-4">
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
      </DrawerContent>
    </Drawer>
  );
}
