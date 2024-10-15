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
import { useSession } from "next-auth/react";
import GenerateImageBtn from "@/components/generateImageBtn";

const tabs = {
  photos: "MY_PHOTOS",
  downloads: "DOWNLOADS",
};

export default function MyPhotos() {
  const router = useRouter();
  const { setSelectedImage, setControlerValue, selectedImage } =
    useAppProvider();
  const [selectedId, toggleDialog] = useState<{
    id: string;
    tab: string;
  } | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [imageList, setImageList] = useState<SelectedImage[]>(() => []);
  const [controlerList, setControlerList] = useState<MyContoler[]>(() => []);
  const session = useSession();
  if (!session?.data) router.push("/");

  useEffect(() => {
    async function init() {
      setLoader(true);
      const [myImages, myContolers] = await Promise.allSettled([
        new Promise(async (res, rej) => {
          const { data } = await getMyImages();
          if (data) res(data);
          else rej();
        }),
        new Promise(async (res, rej) => {
          const { data } = await getControler();
          if (data) res(data);
          else rej();
        }),
      ]);
      if (myImages?.status === "fulfilled")
        setImageList(myImages.value as SelectedImage[]);
      if (myContolers?.status === "fulfilled")
        setControlerList(myContolers.value as MyContoler[]);
      setLoader(false);
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
        <TabsList className="bg-background drop-shadow-2xl dark:text-white drop-shadow-2xl mb-10 rounded-full md:h-14">
          <TabsTrigger
            value={tabs.photos}
            className="mr-2 data-[state=active]:bg-violet-500 rounded-full data-[state=active]:text-white hover:text-white hover:bg-violet-500 md:h-12"
          >
            Uploaded Photos
          </TabsTrigger>
          <TabsTrigger
            value={tabs.downloads}
            className="data-[state=active]:bg-violet-500 rounded-full data-[state=active]:text-white hover:text-white hover:bg-violet-500 md:h-12"
          >
            Downloaded Photos
          </TabsTrigger>
        </TabsList>
        <TabsContent value={tabs.photos}>
          {loader && !imageList.length ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-12">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i}>
                    <div className="aspect-w-1 aspect-h-1">
                      <div className="animate-pulse border-white border-2 md:border-4 drop-shadow-2xl rounded-full">
                        <div className="rounded-full bg-slate-100 h-full w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col justify-center items-center h-80">
                <div className="relative md:h-32 md:w-32 h-14 w-14">
                  <Image
                    placeholder="blur"
                    blurDataURL={constants.blurDataURL}
                    src="/images/no-data.png"
                    layout="fill"
                    objectFit="contain"
                    alt="no-data"
                    loading="lazy"
                  />
                </div>
                <p className="my-2">No data found</p>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-12">
              {imageList.map((i) => (
                <div key={i._id}>
                  <div className="aspect-w-1 aspect-h-1">
                    <div
                      className={`border-white border-white border-2 md:border-4 drop-shadow-2xl rounded-full overflow-hidden`}
                    >
                      <DownloadImage disabled={true} image={i} />
                    </div>
                  </div>
                  <div className="text-center -mt-6 md:-mt-7">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedImage(i);
                        router.push("/customize");
                      }}
                      className="h-10 w-10 mr-2 p-0 hover:bg-violet-500 dark:bg-violet-500 dark:text-white text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        toggleDialog({ id: i._id, tab: tabs.photos })
                      }
                      className="h-10 w-10 p-0 hover:bg-red-500 dark:bg-red-500 text-red-500 dark:text-white drop-shadow-2xl rounded-full bg-background hover:text-white"
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value={tabs.downloads}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-12">
            {!loader && !controlerList.length ? (
              <div className="flex flex-col justify-center items-center h-80">
                <div className="relative md:h-32 md:w-32 h-14 w-14">
                  <Image
                    placeholder="blur"
                    blurDataURL={constants.blurDataURL}
                    src="/images/no-data.png"
                    layout="fill"
                    objectFit="contain"
                    alt="no-data"
                    loading="lazy"
                  />
                </div>
                <p className="mt-2">No data found</p>
              </div>
            ) : (
              <>
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
                            className={`border-white border-2 md:border-4 drop-shadow-2xl ${borderRadius} overflow-hidden`}
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
                        <div className="text-center -mt-6 md:-mt-7">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedImage(imageId);
                              setControlerValue(controler);
                              router.push("/customize");
                            }}
                            className="h-10 w-10 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              i.downloadedImageKey &&
                              downloadImage(i.downloadedImageKey)
                            }
                            className="h-10 w-10 mx-2 p-0 hover:bg-violet-500 text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                          >
                            <Download />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              toggleDialog({ id: i._id, tab: tabs.downloads })
                            }
                            className="h-10 w-10 p-0 hover:bg-red-500 text-red-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!selectedId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete your
              image from your profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="ghost"
              onClick={() => toggleDialog(null)}
              className={`${constants.btnClass} rounded-full hover:bg-background`}
            >
              Cancel
            </Button>
            <Button
              disabled={loader}
              onClick={onDelete}
              className={`${constants.btnClass} rounded-full flex justify-center items-center bg-violet-500`}
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
