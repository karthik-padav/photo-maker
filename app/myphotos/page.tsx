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
import { MyContoler, SelectedImage } from "@/lib/interfaces";
import DownloadImage from "@/components/downloadImage";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import List from "./List";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { onDownload } from "@/lib/common";
import { Download, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const tabs = {
  photos: "MY_PHOTOS",
  downloads: "DOWNLOADS",
};

export default function MyPhotos() {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setSelectedImage, setControlerValue } = useAppProvider();
  const [selectedId, toggleDialog] = useState<{
    id: string;
    tab: string;
  } | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [imageList, setImageList] = useState<SelectedImage[]>(() => []);
  const [controlerList, setControlerList] = useState<MyContoler[]>(() => []);

  useEffect(() => {
    async function init() {
      const { data: myImages } = await getMyImages();
      const { data: myContolers } = await getControler();
      setImageList(myImages);
      setControlerList(myContolers);
    }
    init();
  }, []);

  const downloadImage = async (imageUrl: string) => {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "image.jpg"; // You can set the file name here
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  console.log(controlerList, "controlerList123");
  async function onDelete() {
    if (selectedId?.id) {
      setLoader(true);
      if (selectedId.tab === tabs.photos) {
        const { data } = await deleteImage({ id: selectedId.id });
        data?._id &&
          setImageList((prev) => prev.filter((i) => i._id !== selectedId.id));
      }
      if (selectedId?.tab === tabs.downloads) {
        const { data } = await deleteControler({ id: selectedId.id });
        data?._id &&
          setControlerList((prev) =>
            prev.filter((i) => i._id !== selectedId.id)
          );
      }
      setLoader(false);
      toggleDialog(null);
    }
  }

  return (
    <main className="text-black body-font container">
      <Tabs defaultValue={tabs.photos} className="w-full">
        <TabsList className="bg-background drop-shadow-2xl dark:text-white drop-shadow-2xl mb-10 rounded-full h-14">
          <TabsTrigger
            value={tabs.photos}
            className="mr-2 data-[state=active]:bg-violet-500 rounded-full data-[state=active]:text-white hover:text-white hover:bg-violet-500 h-12"
          >
            Uploaded Photos
          </TabsTrigger>
          <TabsTrigger
            value={tabs.downloads}
            className="data-[state=active]:bg-violet-500 rounded-full data-[state=active]:text-white hover:text-white hover:bg-violet-500 h-12"
          >
            Downloaded Photos
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tabs.photos}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-12">
            {imageList.map((i) => (
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
                    onClick={() => {
                      setSelectedImage(i);
                      router.push("/customize");
                    }}
                    className="h-12 mr-2 w-12 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      toggleDialog({ id: i._id, tab: tabs.photos })
                    }
                    className="h-12 w-12 p-0 hover:bg-red-500 text-red-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value={tabs.downloads}>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-12">
            {controlerList.map((i) => {
              if (i?.imageId?._id && i?.downloadedImageKey) {
                const { controler = {}, imageId } = i;
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
                        onClick={() => {
                          setSelectedImage(imageId);
                          setControlerValue(controler);
                          router.push("/customize");
                        }}
                        className="h-12 w-12 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          toggleDialog({ id: i._id, tab: tabs.downloads })
                        }
                        className="h-12 w-12 mx-2 p-0 hover:bg-red-500 text-red-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                      >
                        <Trash2 />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          i.downloadedImageKey &&
                          downloadImage(i.downloadedImageKey)
                        }
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
        </TabsContent>
      </Tabs>

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
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
