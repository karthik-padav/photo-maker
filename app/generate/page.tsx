"use client";

import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useRef } from "react";
import Image from "next/image";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Generate() {
  const router = useRouter();
  const { selectedImage, controlerValue, setControlerValue } = useAppProvider();
  const imageWrapperRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const session = useSession();
  if (!selectedImage || !session?.data) router.push("/");

  function handleRedirect(item: { id: string; backgroundImagePath?: string }) {
    if (item?.backgroundImagePath)
      setControlerValue({
        ...controlerValue,
        backgroundImagePath: item.backgroundImagePath,
      });
    router.push("/customize");
  }

  const borderRadius = controlerValue?.border?.value
    ? controlerValue.border.value
    : "";

  return (
    <main className="text-black body-font container">
      {selectedImage && (
        <>
          <div className="mb-12 flex flex-wrap gap-2">
            <EditBar />
          </div>

          {/* <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-12">
            {constants.pngBgCollections.map((item) => {
              if (!item.backgroundImagePath) return null;
              return (
                <div key={item.id}>
                  <div
                    className="aspect-w-1 aspect-h-1 relative"
                    ref={(e: HTMLDivElement) => {
                      if (imageWrapperRef.current) {
                        imageWrapperRef.current[item.id] = e;
                      }
                    }}
                  >
                    <div
                      className={`w-full h-full border-white dark:border-gray-800 border-4 drop-shadow-2xl overflow-hidden ${borderRadius}`}
                    >
                      <Image
                        className="z-40"
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        src={item.backgroundImagePath}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                        alt="Background image"
                        loading="lazy"
                      />

                      <Image
                        className="z-40"
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${selectedImage.imagePath}`}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                        alt={`Editable image: ${selectedImage.id}`}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="text-center -mt-6 md:-mt-7">
                    <Button
                      onClick={() => handleRedirect(item)}
                      className="drop-shadow-2xl rounded-full py-2 px-4 md:py-4 md:px-6 bg-violet-500 hover:bg-violet-500 text-white"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              );
            })}
          </div> */}
        </>
      )}
    </main>
  );
}
