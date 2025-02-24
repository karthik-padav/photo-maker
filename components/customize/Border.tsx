import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DownloadImage from "../downloadImage";
import { borderControlers } from "@/lib/common";
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
import ColorPicker from "../colorPicker";

export default function Border() {
  const { setSelectedImage, selectedImage, controlerValue, setControlerValue } =
    useAppProvider();

  const controler: any = borderControlers(controlerValue);

  return (
    <>
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
              onChange={(e) => {
                setControlerValue({ ...controlerValue, [key]: e.target.value });
              }}
              {...data.attr}
            />
          </div>
        );
      })}

      <ColorPicker
        allowedList={["bg"]}
        onClick={(obj: { [key: string]: string }) =>
          setControlerValue({
            ...controlerValue,
            outerBorderColor: obj.color,
          })
        }
      />
    </>
  );
}
