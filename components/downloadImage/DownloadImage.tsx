"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import constants from "@/lib/constants";
import {
  calcPercentage,
  calcPx,
  extractValues,
  getBgStyles,
  getBorderStyles,
  getImageStyle,
} from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import Draggable from "react-draggable";
import { useRef, useState } from "react";

interface Params {
  image: SelectedImage;
  controler?: ControlerValue;
  disabled?: boolean;
}

export default function DownloadImage({
  image,
  controler,
  disabled = false,
}: Params) {
  const { setControlerValue } = useAppProvider();
  const [imageWrapperSize, setImageWrapperSize] = useState<number>(100);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  if (!image?.imageKey) return null;

  let imageStyle,
    borderStyle,
    imageBgStyle = {};
  if (controler) {
    const { transform, ...rest } = controler;
    imageStyle = getImageStyle(rest);
    imageBgStyle = getBgStyles({
      controlerValue: controler,
    });
    borderStyle = getBorderStyles(
      controler,
      imageWrapperRef?.current?.offsetWidth
    );
  }

  function handleImageLoad() {
    if (imageWrapperRef?.current?.offsetWidth) {
      setImageWrapperSize(imageWrapperRef.current.offsetWidth);
      setControlerValue({
        imageWrapperSize: imageWrapperRef.current.offsetWidth,
      });
    }
  }
  function handleDrop(e: any, ui: { x: number; y: number }) {
    setControlerValue({
      ...controler,
      ["transform"]: {
        x: imageWrapperRef?.current?.offsetWidth
          ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.x)
          : 0,
        y: imageWrapperRef?.current?.offsetWidth
          ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.y)
          : 0,
      },
    });
  }

  const borderRadius = controler?.border?.value ? controler.border.value : "";
  return (
    <div
      ref={imageWrapperRef}
      className={`relative w-full h-full overflow-hidden ${borderRadius}`}
    >
      <div
        className={`_border absolute top-0 bottom-0 right-0 left-0 z-30 ${borderRadius}`}
        style={borderStyle}
      />
      <div
        className={`_bg absolute top-0 bottom-0 right-0 left-0 z-20 ${borderRadius}`}
        style={imageBgStyle}
      />
      <div
        className={`_imageWrapper absolute top-0 bottom-0 right-0 left-0 z-50 ${borderRadius}`}
      >
        <Draggable
          disabled={disabled}
          defaultPosition={{
            x: controler?.transform?.x
              ? calcPx(imageWrapperSize, controler.transform.x)
              : 0,
            y: controler?.transform?.y
              ? calcPx(imageWrapperSize, controler.transform.y)
              : 0,
          }}
          onStop={handleDrop}
          bounds={{
            top: -(imageWrapperSize - 462 * (30 / 100)),
            left: -(imageWrapperSize - 462 * (30 / 100)),
            right: imageWrapperSize - 462 * (30 / 100),
            bottom: imageWrapperSize - 462 * (30 / 100),
          }}
        >
          <div className="relative h-full w-full">
            <div className="absolute top-0 bottom-0 right-0 left-0 z-50" />
            <Image
              className="z-40"
              style={imageStyle}
              placeholder="blur"
              blurDataURL={constants.blurDataURL}
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imageKey}`}
              layout="fill"
              objectFit="contain"
              alt="profile pic"
              quality={10}
              loading="lazy"
              onLoadingComplete={handleImageLoad}
            />
          </div>
        </Draggable>
      </div>
    </div>
  );
  // return (
  //   <div
  //     // className="w-full h-full bg-gray-100 overflow-hidden rounded-full"
  //     {...attr}
  //     ref={imageWrapperRef}
  //   >
  //     <Draggable
  //       disabled={disabled}
  //       position={{
  //         x: controler?.transform?.x
  //           ? calcPx(imageWrapperSize, controler.transform.x)
  //           : 0,
  //         y: controler?.transform?.y
  //           ? calcPx(imageWrapperSize, controler.transform.y)
  //           : 0,
  //       }}
  //     >
  //       <div className="h-full w-full">
  //         {/* <div className="absolute top-0 bottom-0 right-0 left-0 z-10" /> */}
  //         <Image
  //           // style={imageStyle}
  //           placeholder="blur"
  //           blurDataURL={constants.blurDataURL}
  //           src={image.imageURL}
  //           layout="fill"
  //           objectFit="contain"
  //           alt="profile pic"
  //           loading="lazy"
  //           onLoadingComplete={handleImageLoad}
  //         />
  //       </div>
  //     </Draggable>
  //   </div>
  // );
}
