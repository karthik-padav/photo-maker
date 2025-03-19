"use client";

import { useAppProvider } from "@/lib/app-provider";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import Image from "next/image";
import constants from "@/lib/constants";
import EditBar from "@/components/editBar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Generate() {
  const router = useRouter();
  const { selectedImage, controlerValue, setControlerValue, bgImages } =
    useAppProvider();
  const session = useSession();

  useEffect(() => {
    if (!selectedImage || !session?.data) router.push("/");
  }, [selectedImage, session?.data, router]);

  function handleRedirect(item: { id: string; backgroundImagePath?: string }) {
    if (item?.backgroundImagePath)
      setControlerValue({
        ...controlerValue,
        backgroundImagePath: item.backgroundImagePath,
      });
    router.push("/customize");
  }

  const borderRadius = controlerValue?.border
    ? controlerValue.border.value
    : 50;

  return (
    <main className="text-black body-font px-5 md:px-0 md:container">
      {selectedImage && (
        <>
          <div className="mb-12 flex flex-wrap gap-2">
            <EditBar />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-12">
            {bgImages.map((item) => {
              if (!item.key) return null;
              return (
                <div key={item.key}>
                  <div className="aspect-w-1 aspect-h-1 relative">
                    <div
                      className={cn(
                        "w-full h-full border-white dark:border-gray-800 border-4 drop-shadow-2xl overflow-hidden asdas",
                        borderRadius > 49
                          ? "rounded-full"
                          : borderRadius > 19
                          ? "rounded-2xl"
                          : ""
                      )}
                    >
                      <Image
                        className="z-40"
                        placeholder="blur"
                        blurDataURL={constants.blurDataURL}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.key}`}
                        fill
                        sizes="100%"
                        style={{ objectFit: "cover" }}
                        alt="Background image"
                        loading="lazy"
                      />

                      {selectedImage.imagePath && (
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
                      )}
                    </div>
                  </div>
                  <div className="text-center -mt-6 md:-mt-7">
                    <Button
                      onClick={() =>
                        handleRedirect({
                          id: item.key,
                          backgroundImagePath: item.key,
                        })
                      }
                      className="drop-shadow-2xl rounded-full py-2 px-4 md:py-4 md:px-6 bg-violet-500 hover:bg-violet-500 text-white"
                    >
                      Customize
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
