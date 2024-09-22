import Image from "next/image";
import { useTheme } from "next-themes";
import constants from "@/lib/constants";
import { calcPx, extractValues, getImageStyle } from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import Draggable from "react-draggable";
import { useRef, useState } from "react";

interface Params {
  imageBgStyle?: {
    [key: string]: string | number | undefined;
  };
  imageData?: { [key: string]: string };
  onHoverEffect?: boolean;
  selectedImage: SelectedImage;
  controlerValue: ControlerValue;
  className?: string;
}

export default function DownloadImage({
  imageBgStyle,
  imageData,
  selectedImage,
  controlerValue,
  className = "",
}: Params) {
  const { setSelectedImage, setControlerValue } = useAppProvider();
  const imageStyle = getImageStyle(controlerValue);
  if (!selectedImage?.imageURL) return null;
  let attr: { [key: string]: any } = {
    className: `${className} ${controlerValue?.border?.value} w-full h-full overflow-hidden bg-cover`,
    style: { ...imageBgStyle },
  };
  const [imageWrapperSize, setImageWrapperSize] = useState<number>(100);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  function handleImageLoad() {
    if (imageWrapperRef?.current?.offsetWidth) {
      setImageWrapperSize(imageWrapperRef.current.offsetWidth);
    }
  }
  return (
    <div
      // className="w-full h-full bg-gray-100 overflow-hidden rounded-full"
      {...attr}
      ref={imageWrapperRef}
    >
      <Draggable
        disabled={true}
        position={{
          x: controlerValue?.transform?.x
            ? calcPx(imageWrapperSize, controlerValue.transform.x)
            : 0,
          y: controlerValue?.transform?.y
            ? calcPx(imageWrapperSize, controlerValue.transform.y)
            : 0,
        }}
      >
        <div className="h-full w-full">
          {/* <div className="absolute top-0 bottom-0 right-0 left-0 z-10" /> */}
          <Image
            style={imageStyle}
            placeholder="blur"
            blurDataURL={constants.blurDataURL}
            src={selectedImage.imageURL}
            layout="fill"
            objectFit="contain"
            alt="profile pic"
            loading="lazy"
            onLoadingComplete={handleImageLoad}
          />
        </div>
      </Draggable>
    </div>
  );
}
