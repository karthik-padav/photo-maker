import Image from "next/image";
import { useTheme } from "next-themes";
import constants from "@/lib/constants";
import { getImageStyle } from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { ControlerValue, CurrentImage } from "@/lib/interfaces";

interface Params {
  imageBgStyle?: {
    [key: string]: string | number | undefined;
  };
  assignRef?: (e: HTMLDivElement) => void;
  imageData?: { [key: string]: string };
  onHoverEffect?: boolean;
  selectedImage: CurrentImage;
  controlerValue: ControlerValue;
  className?: string;
}

export default function DownloadImage({
  imageBgStyle,
  assignRef = () => {},
  imageData,
  selectedImage,
  controlerValue,
  className = "",
}: Params) {
  const { setCurrentImage, setControlerValue } = useAppProvider();
  const imageStyle = getImageStyle(controlerValue);
  if (!selectedImage?.imageURL) return null;
  let attr: { [key: string]: any } = {
    className: `${controlerValue?.border?.value} w-full h-full overflow-hidden bg-cover`,
    style: { ...imageBgStyle },
  };
  if (assignRef) attr["ref"] = assignRef;
  return (
    <div
      className={`${className} ${controlerValue?.border?.value} w-full h-full overflow-hidden transition duration-300 `}
    >
      <div {...attr}>
        <Image
          placeholder="blur"
          blurDataURL={constants.blurDataURL}
          loading="lazy"
          src={selectedImage.imageURL}
          layout="fill"
          objectFit="contain"
          alt="profile pic"
          style={{ ...imageStyle }}
        />
      </div>
    </div>
  );
}
