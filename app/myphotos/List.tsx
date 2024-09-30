"use client";
import { useAppProvider } from "@/lib/app-provider";

import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import {
  deleteControler,
  deleteImage,
  getControler,
  getMyImages,
} from "@/lib/actions/services";
import { ControlerValue, MyContoler, SelectedImage } from "@/lib/interfaces";
import DownloadImage from "@/components/downloadImage";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calcPx,
  getBgStyles,
  getBorderStyles,
  getImageStyle,
  onDownload,
} from "@/lib/common";
import { Pencil, Download, Trash2, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import Draggable from "react-draggable";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MyContolerProps {
  controler?: MyContoler[] | null;
  images?: SelectedImage[] | null;
}

export default function List(props: MyContolerProps) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setSelectedImage, setControlerValue } = useAppProvider();
  const [selectedId, toggleDialog] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [imageList, setImageList] = useState<SelectedImage[]>(
    () => props?.images || []
  );
  const [controlerList, setCntrolerList] = useState<MyContoler[]>(
    () => props?.controler || []
  );

  console.log(props, "props123");
  async function download() {
    await onDownload(imageWrapperRef.current);
  }

  function handleRedirect(item: SelectedImage) {
    setSelectedImage({ ...item });
    router.push("/customize");
  }
  console.log(selectedId, "imageId123");

  async function onDelete() {
    if (selectedId) {
      setLoader(true);
      if (imageList?.length) {
        const { data } = await deleteImage({ id: selectedId });
        data?._id &&
          setImageList((prev) => prev.filter((i) => i._id !== selectedId));
      } else if (controlerList?.length) {
        const { data } = await deleteControler({ id: selectedId });
        data?._id &&
          setCntrolerList((prev) => prev.filter((i) => i._id !== selectedId));
      }
      setLoader(false);
      toggleDialog(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-12">
        {imageList?.length > 0 &&
          imageList.map((i) => (
            <div key={i._id}>
              <div className="aspect-w-1 aspect-h-1">
                <div
                  className={`border-white border-4 drop-shadow-2xl rounded-full overflow-hidden`}
                >
                  <DownloadImage disabled={true} image={i} />
                </div>
              </div>
              <div className="text-center -mt-4">
                <Button
                  variant="ghost"
                  onClick={() => handleRedirect(i)}
                  className="h-12 mr-2 w-12 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                >
                  <Pencil />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => toggleDialog(i._id)}
                  className="h-12 w-12 p-0 hover:bg-red-500 text-red-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                >
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
        {controlerList?.length > 0 &&
          controlerList.map((i) => {
            if (i?.imageId?._id && i?.downloadedImageKey) {
              const { controler = {} } = i;
              const borderRadius = controler?.border?.value
                ? controler.border.value
                : "";
              return (
                <div key={i._id}>
                  <div className="aspect-w-1 aspect-h-1">
                    <div
                      className={`border-white border-4 drop-shadow-2xl ${borderRadius}`}
                    >
                      <Image
                        className="overflow-hidden"
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${i.downloadedImageKey}`}
                        layout="fill"
                        objectFit="contain"
                        alt="profile pic"
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="text-center -mt-4">
                    <Button
                      variant="ghost"
                      // onClick={() => handleRedirect(i)}
                      className="h-12 w-12 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => toggleDialog(i._id)}
                      className="h-12 w-12 mx-2 p-0 hover:bg-red-500 text-red-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                    >
                      <Trash2 />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={download}
                      className="h-12 w-12 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                    >
                      <Download />
                    </Button>
                  </div>
                </div>
              );
            }
            return null;
          })}
      </div>

      <AlertDialog open={!!selectedId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={() => toggleDialog(null)}
              className="drop-shadow-2xl rounded-full py-4 px-6"
            >
              Cancel
            </Button>
            <Button
              disabled={loader}
              onClick={onDelete}
              className="drop-shadow-2xl rounded-full py-4 px-6 bg-violet-500 hover:bg-violet-500 text-white relative"
            >
              {loader && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin absolute" />
              )}
              <span className={`${loader && "invisible"}`}>Delete</span>
            </Button>
            {/* <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction> */}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
