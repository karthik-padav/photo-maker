"use client";
import { useAppProvider } from "@/lib/app-provider";
import constants from "@/lib/constants";
import { deleteControler, deleteImage } from "@/lib/actions/services";
import { ControlerValue, MyContoler, SelectedImage } from "@/lib/interfaces";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import { uid } from "uid";
import ADS from "@/components/ads";

const tabs = {
  photos: "MY_PHOTOS",
  downloads: "DOWNLOADS",
};

export default function MyPhotosWrapper({
  imageData,
  controlerData,
}: {
  controlerData: MyContoler[];
  imageData: SelectedImage[];
}) {
  const router = useRouter();
  const { setSelectedImage, setControlerValue } = useAppProvider();
  const [selectedId, toggleDialog] = useState<{
    id: string;
    tab: string;
  } | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const [imageList, setImageList] = useState<SelectedImage[]>(() => imageData);
  const [controlerList, setControlerList] = useState<MyContoler[]>(
    () => controlerData
  );
  const session = useSession();

  useEffect(() => {
    if (!session?.data) router.push("/");
  }, [session?.data, router]);

  const downloadImage = async (imageUrl: string) => {
    const getImageExtension = () => {
      const extension = (imageUrl || "").split(".").pop();
      return extension ? extension.split(/\#|\?/)[0] : "png";
    };
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-${uid(
      16
    )}.${getImageExtension()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  async function onDelete() {
    if (selectedId?.id) {
      setLoader(true);
      if (selectedId.tab === tabs.photos) {
        const { data } = await deleteImage({ id: selectedId.id });
        data?.id &&
          setImageList((prev) => prev.filter((i) => i.id !== selectedId.id));
      }
      if (selectedId?.tab === tabs.downloads) {
        const { data } = await deleteControler({ id: selectedId.id });
        data?.id &&
          setControlerList((prev) =>
            prev.filter((i) => i.id !== selectedId.id)
          );
      }
      setLoader(false);
      toggleDialog(null);
    }
  }

  return (
    <main className="body-font md:container md:p-0 px-4 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-6">
        <div className="col-span-2">
          <ADS />
        </div>
        <div className="col-span-8">
          <Tabs defaultValue={tabs.photos} className="w-full">
            <TabsList className="flex md:inline-block bg-background drop-shadow-2xl dark:text-white drop-shadow-2xl md:mb-10 mb-4 rounded-full h-auto md:p-2">
              <TabsTrigger
                value={tabs.photos}
                className="text-wrap block md:inline-flex w-full md:w-auto md:mr-2 data-[state=active]:bg-violet-500 rounded-full data-[state=active]:text-white hover:text-white hover:bg-violet-500 py-2 px-4"
              >
                Uploaded Photos
              </TabsTrigger>
              <TabsTrigger
                value={tabs.downloads}
                className="text-wrap block md:inline-flex w-full md:w-auto md:mr-2 data-[state=active]:bg-violet-500 rounded-full data-[state=active]:text-white hover:text-white hover:bg-violet-500 py-2 px-4"
              >
                Downloaded Photos
              </TabsTrigger>
            </TabsList>
            <TabsContent value={tabs.photos}>
              {loader && !imageList.length && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <div className="aspect-w-1 aspect-h-1">
                        <div className="animate-pulse w-full h-full border-white border-2 md:border-4 drop-shadow-2xl rounded-full">
                          <div className="rounded-full bg-slate-100 h-full w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loader && !imageList.length && (
                <div className="flex flex-col justify-center items-center h-80">
                  <div className="relative md:h-32 md:w-32 h-14 w-14">
                    <Image
                      placeholder="blur"
                      blurDataURL={constants.blurDataURL}
                      src="/images/no-data.png"
                      fill
                      sizes="100%"
                      style={{ objectFit: "contain" }}
                      alt="no-data"
                      loading="lazy"
                    />
                  </div>
                  <p className="my-2 dark:text-white">No data found</p>
                </div>
              )}

              {!loader && imageList.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                  {imageList.map((i) => (
                    <div key={i.id}>
                      <div className="aspect-w-1 aspect-h-1">
                        <div
                          className={`border-white dark:border-gray-800 w-full h-full border-white border-2 md:border-4 drop-shadow-2xl rounded-full overflow-hidden`}
                        >
                          <Image
                            placeholder="blur"
                            blurDataURL={constants.blurDataURL}
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${i.imagePath}`}
                            fill
                            sizes="100%"
                            style={{ objectFit: "cover" }}
                            alt="profile pic"
                            quality={10}
                            loading="lazy"
                          />
                        </div>
                      </div>
                      <div className="text-center -mt-6 md:-mt-7">
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setSelectedImage({
                              id: i.id,
                              imagePath: `${process.env.NEXT_PUBLIC_IMAGE_URL}${i.imagePath}`,
                              key: i.imagePath,
                            });
                            router.push("/customize");
                          }}
                          className="h-10 w-10 mr-2 p-0 hover:bg-violet-500 dark:bg-violet-500 dark:text-white text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                        >
                          <Pencil />
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            toggleDialog({ id: i.id, tab: tabs.photos })
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
              {loader && controlerList.length === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i}>
                      <div className="aspect-w-1 aspect-h-1">
                        <div className="animate-pulse w-full h-full border-white border-2 md:border-4 drop-shadow-2xl rounded-full">
                          <div className="rounded-full bg-slate-100 h-full w-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {!loader && controlerList.length === 0 && (
                <div className="flex flex-col justify-center items-center h-80">
                  <div className="relative md:h-32 md:w-32 h-14 w-14">
                    <Image
                      placeholder="blur"
                      blurDataURL={constants.blurDataURL}
                      src="/images/no-data.png"
                      fill
                      sizes="100%"
                      style={{ objectFit: "contain" }}
                      alt="no-data"
                      loading="lazy"
                    />
                  </div>
                  <p className="my-2 dark:text-white">No data found</p>
                </div>
              )}
              {!loader && controlerList.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                  {controlerList.map((i, index) => {
                    const {
                      controler = {} as ControlerValue,
                      image = {} as SelectedImage,
                      id,
                      downloadedImagePath,
                    } = i;
                    if (!downloadedImagePath) return null;
                    return (
                      <div key={index}>
                        <div className="aspect-w-1 aspect-h-1">
                          <div
                            className={`border-white dark:border-gray-800 w-full h-full border-white border-2 md:border-4 drop-shadow-2xl rounded-full overflow-hidden`}
                          >
                            <Image
                              placeholder="blur"
                              blurDataURL={constants.blurDataURL}
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${downloadedImagePath}`}
                              fill
                              sizes="100%"
                              style={{ objectFit: "contain" }}
                              alt="profile pic"
                              quality={10}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="text-center -mt-6 md:-mt-7">
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setSelectedImage({
                                id: image.id,
                                imagePath: `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`,
                                key: image.imagePath,
                              });
                              setControlerValue(controler);
                              router.push("/customize");
                            }}
                            className="h-10 w-10 mr-2 p-0 hover:bg-violet-500 dark:bg-violet-500 dark:text-white text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              downloadedImagePath &&
                              downloadImage(
                                `${process.env.NEXT_PUBLIC_IMAGE_URL}${downloadedImagePath}`
                              )
                            }
                            className="h-10 w-10 mr-2 p-0 hover:bg-violet-500 dark:bg-violet-500 dark:text-white text-violet-500 drop-shadow-2xl rounded-full bg-background hover:text-white"
                          >
                            <Download />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() =>
                              id &&
                              toggleDialog({ id: id, tab: tabs.downloads })
                            }
                            className="h-10 w-10 p-0 hover:bg-red-500 dark:bg-red-500 text-red-500 dark:text-white drop-shadow-2xl rounded-full bg-background hover:text-white"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="col-span-2">
          <ADS />
        </div>
      </div>

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
              className={`${constants.btnClass} mb-2 rounded-full hover:bg-background hover:text-accent-foreground`}
            >
              Cancel
            </Button>
            <Button
              disabled={loader}
              onClick={onDelete}
              className={`${constants.btnClass} mb-2 rounded-full flex justify-center items-center bg-violet-500`}
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
