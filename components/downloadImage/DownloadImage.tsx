"use client";

import Image from "next/image";
import constants from "@/lib/constants";
import {
  calcPercentage,
  calcPx,
  getBorderStyles,
  getImageStyle,
} from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import Draggable from "react-draggable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageLoadingTracker = useRef<{ [key: string]: boolean }>({});
  const [isLoading, setLoader] = useState<boolean>(true);
  if (!image?.imagePath) return null;

  const imageStyle = useMemo(() => getImageStyle(controler), [controler]);
  const borderStyle = useMemo(
    () => getBorderStyles(controler, controler?.imageWrapperSize || 100),
    [controler]
  );

  useEffect(() => {
    if (imageWrapperRef?.current?.offsetWidth)
      setControlerValue({
        imageWrapperSize: imageWrapperRef?.current?.offsetWidth,
      });
  }, [imageWrapperRef?.current?.offsetWidth]);

  const handleImageLoad = useCallback(
    (track: string) => {
      imageLoadingTracker.current[track] = true;
      if (
        imageLoadingTracker.current.mainImage &&
        (!!controler?.backgroundImagePath
          ? imageLoadingTracker.current.bgImage
          : true)
      )
        setLoader(true);
    },
    [controler]
  );

  const handleDrop = useCallback(
    (e: any, ui: { x: number; y: number }) => {
      setControlerValue({
        ...controler,
        transformX: imageWrapperRef?.current?.offsetWidth
          ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.x)
          : 0,
        transformY: imageWrapperRef?.current?.offsetWidth
          ? calcPercentage(imageWrapperRef.current.offsetWidth, ui.y)
          : 0,
      });
    },
    [setControlerValue]
  );

  const borderRadius = controler?.border?.value ? controler.border.value : "";

  return (
    <div
      ref={imageWrapperRef}
      className={`relative w-full h-full overflow-hidden ${borderRadius}`}
    >
      {controler?.imageWrapperSize && (
        <>
          {/* Border Layer */}
          <div
            className={`_border absolute inset-0 z-40 ${borderRadius}`}
            style={borderStyle}
          />

          {/* Background Color Layer */}
          {controler?.backgroundColor && (
            <div
              className={`_bgColor absolute inset-0 z-30 ${borderRadius}`}
              style={{
                background: controler.backgroundColor,
                transform: `rotate(${controler.backgroundRotate}deg)`,
              }}
            />
          )}

          {/* Background Image Layer */}
          {controler?.backgroundImagePath && (
            <div className={`_bg absolute inset-0 z-20 ${borderRadius}`}>
              <Image
                className="z-40"
                style={{
                  scale: controler.backgroundScale,
                  transform: `rotate(${controler.backgroundRotate}deg)`,
                  objectFit: "cover",
                }}
                placeholder="blur"
                blurDataURL={constants.blurDataURL}
                src={controler.backgroundImagePath}
                fill
                sizes="100%"
                quality={100}
                alt="Background image"
                loading="lazy"
                onLoad={() => handleImageLoad("bgImage")}
              />
            </div>
          )}

          {/* Main Image with Draggable */}
          <div
            className={`_imageWrapper absolute inset-0 z-50 ${borderRadius}`}
          >
            <Draggable
              disabled={disabled}
              defaultPosition={{
                x: controler?.transformX
                  ? calcPx(
                      controler.imageWrapperSize,
                      Number(controler.transformX)
                    )
                  : 0,
                y: controler?.transformY
                  ? calcPx(
                      controler.imageWrapperSize,
                      Number(controler.transformY)
                    )
                  : 0,
              }}
              onStop={handleDrop}
              bounds={{
                top: -(controler.imageWrapperSize - 462 * 0.3),
                left: -(controler.imageWrapperSize - 462 * 0.3),
                right: controler.imageWrapperSize - 462 * 0.3,
                bottom: controler.imageWrapperSize - 462 * 0.3,
              }}
            >
              <div className="relative h-full w-full">
                <div className="absolute inset-0 z-50" />
                <Image
                  className="z-40"
                  style={{ objectFit: "contain", ...imageStyle }}
                  placeholder="blur"
                  blurDataURL={constants.blurDataURL}
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`}
                  fill
                  sizes="100%"
                  alt={`Editable image: ${image.imagePath}`}
                  quality={100}
                  loading="lazy"
                  onLoad={() => handleImageLoad("mainImage")}
                />
              </div>
            </Draggable>
          </div>
        </>
      )}
    </div>
  );
}
