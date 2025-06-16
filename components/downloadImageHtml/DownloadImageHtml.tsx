"use client";

import { useAppProvider } from "@/lib/app-provider";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import { useEffect, useRef } from "react";
import { calcPercentage, calcPx, getImageStyle, rgbToRgba } from "@/lib/common";
import Dragable from "../dragable";

interface Params {
  image: SelectedImage;
  controler?: ControlerValue;
  disabled?: boolean;
}

export default function DownloadImageHtml({ image, controler }: Params) {
  if (!image.imagePath) return null;
  const imageStyle = getImageStyle(controler);
  const borderRadius = { borderRadius: `${controler?.border?.value || 0}%` };
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { setControlerValue } = useAppProvider();
  useEffect(() => {
    if (imageWrapperRef?.current?.offsetWidth)
      setControlerValue({
        imageWrapperSize: imageWrapperRef.current.offsetWidth,
      });
  }, [imageWrapperRef?.current?.offsetWidth]);

  const imageWrapperWidth =
    imageWrapperRef?.current?.offsetWidth || controler?.imageWrapperSize || 300;

  return (
    <div className="w-full h-full relative">
      <div
        className="relative w-full h-full overflow-hidden"
        id="my-node"
        ref={imageWrapperRef}
        style={borderRadius}
      >
        {controler?.outerBorderWidth != "0" &&
          controler?.outerBorderColor &&
          controler?.outerBorderOpacity != "0" && (
            <div
              className="_outerBorder absolute top-0 left-0 bottom-0 right-0 z-20"
              style={{
                borderWidth: `${controler.outerBorderWidth}px`,
                borderStyle: "solid",
                borderColor: rgbToRgba(
                  controler?.outerBorderColor,
                  controler?.outerBorderOpacity
                ),
                ...borderRadius,
              }}
            />
          )}

        {/* Background Color Layer */}
        {controler?.backgroundColor && (
          <div
            className={`_bgColor absolute inset-0 z-10`}
            style={{
              background: controler.backgroundColor,
              transform: `rotate(${controler.backgroundRotate}deg)`,
            }}
          />
        )}

        {/* Background Image Layer */}
        {controler?.backgroundImagePath && (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${controler?.backgroundImagePath}`}
            alt="bg image"
            className="w-full h-full absolute object-cover z-10"
            crossOrigin="anonymous"
            style={{
              transform: `scale(${controler?.backgroundScale || 1}) rotate(${
                controler?.backgroundRotate || 0
              }deg)`,
            }}
          />
        )}

        <Dragable
          src={image.imagePath}
          alt="image"
          className="w-full h-full absolute object-contain z-30 cursor-grabbing"
          crossOrigin="anonymous"
          position={{
            x: calcPx(imageWrapperWidth, controler?.transformX || 0),
            y: calcPx(imageWrapperWidth, controler?.transformY || 0),
          }}
          style={imageStyle}
          onUpdate={({ x, y }) => {
            const transformX = calcPercentage(imageWrapperWidth, x);
            const transformY = calcPercentage(imageWrapperWidth, y);
            setControlerValue({ transformX, transformY });
          }}
        />
      </div>
    </div>
  );
}
