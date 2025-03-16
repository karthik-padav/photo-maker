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
import {
  DndContext,
  useDraggable,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";

interface Params {
  image: SelectedImage;
  controler?: ControlerValue;
  disabled?: boolean;
}

export default function DownloadImage({ image, controler }: Params) {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: { distance: 5 },
    })
  );
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
        setLoader(false);
    },
    [controler]
  );

  function DragDropDemo() {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "draggable-box",
    });

    const x =
      (transform?.x || 0) +
      calcPx(controler?.imageWrapperSize || 0, controler?.transformX || 0);
    const y =
      (transform?.y || 0) +
      calcPx(controler?.imageWrapperSize || 0, controler?.transformY || 0);

    return (
      <div
        ref={setNodeRef}
        style={{ transform: `translate3d(${x}px, ${y}px, 0)` }}
        {...listeners}
        {...attributes}
        className="relative h-full w-full"
      >
        <Image
          className="z-40"
          style={{ objectFit: "contain", ...imageStyle }}
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`}
          fill
          sizes="100%"
          alt={`Editable image: ${image.imagePath}`}
          loading="lazy"
          onLoad={() => handleImageLoad("mainImage")}
        />
      </div>
    );
  }

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
            <DndContext
              sensors={sensors}
              onDragEnd={(event) => {
                setControlerValue({
                  transformX: calcPercentage(
                    controler?.imageWrapperSize || 0,
                    calcPx(
                      controler?.imageWrapperSize || 0,
                      controler?.transformX || 0
                    ) + event.delta.x
                  ),
                  transformY: calcPercentage(
                    controler?.imageWrapperSize || 0,
                    calcPx(
                      controler?.imageWrapperSize || 0,
                      controler?.transformY || 0
                    ) + event.delta.y
                  ),
                });
              }}
            >
              <div className="relative w-full h-full">
                <DragDropDemo />
              </div>
            </DndContext>
          </div>
        </>
      )}
    </div>
  );
}
