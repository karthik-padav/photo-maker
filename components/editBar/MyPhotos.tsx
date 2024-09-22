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
import { myPhotoControlers } from "@/lib/common";
import Draggable from "react-draggable";
import { ScrollArea } from "../ui/scroll-area";
import DrawerWrapper from "../drawerWrapper";
import { getCookie, getControler } from "@/lib/actions/server.action";
import axios from "axios";
import DownloadImage from "../downloadImage";
import { SelectedImage } from "@/lib/interfaces";
import { LoaderCircle } from "lucide-react";

export default function MyPhotos() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setSelectedImage, selectedImage, controlerValue, setControlerValue } =
    useAppProvider();
  const [imageData, setImageData] = useState<{
    loader: boolean;
    limit: number;
    offset: number;
    list: SelectedImage[];
  }>({ loader: false, limit: 50, offset: 0, list: [] });

  useEffect(() => {
    if (isOpen) {
      loadMyImage();
      console.log("trigged");
      loadMyControler();
    } else {
      setImageData({ loader: false, limit: 50, offset: 0, list: [] });
    }
  }, [isOpen]);

  async function loadMyImage() {
    setImageData((prev) => ({ ...prev, loader: true }));
    const cookies = await getCookie();
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getImage`,
      { headers: { Authorization: `Bearer ${cookies?.value}` } }
    );
    setImageData((prev) => {
      let obj = {
        loader: false,
        list: data?.length ? [...prev.list, ...data] : prev.list,
      };
      return { ...prev, ...obj };
    });
  }

  async function loadMyControler() {
    const resp = await getControler();
  }

  return (
    <>
      <Button
        variant="outline"
        className={`border-white drop-shadow-2xl rounded-full p-6 mr-4`}
        onClick={() => setIsOpen(true)}
      >
        My Photos
      </Button>

      <DrawerWrapper
        title="My Photos"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <ScrollArea className="h-[70vh] w-full p-4 flex items-center">
          {imageData.list.length > 0 && (
            <div className="grid grid-cols-5 gap-6">
              {imageData.list.map((item) => (
                <div
                  key={item._id}
                  className="aspect-w-1 aspect-h-1 relative"
                  onClick={() => {
                    const { _id, imageURL, email } = item;
                    setSelectedImage({ _id, imageURL, email });
                    setIsOpen(false);
                  }}
                >
                  <DownloadImage
                    selectedImage={item}
                    className="drop-shadow-md border-white border-2 cursor-pointer"
                    controlerValue={{
                      border: { title: "Round", value: "rounded-full" },
                      pngShadow: "2",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          {imageData.loader && (
            <div className="w-full h-full flex justify-center items-center">
              <LoaderCircle className="animate-spin h-10 w-10 " />
            </div>
          )}
        </ScrollArea>
      </DrawerWrapper>
    </>
  );
}
