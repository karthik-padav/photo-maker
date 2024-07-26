import Image from "next/image";
import { useTheme } from "next-themes";
import constants from "@/lib/constants";
import { getImageStyle } from "@/lib/common";
import { useAppProvider } from "../app-provider";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { ControlerValue, CurrentImage } from "@/lib/interfaces";

interface Params {
  imageBgStyle?: {
    [key: string]: string | number | undefined;
  };
  onDownload?: (value: string) => void;
  assignRef?: (e: HTMLDivElement) => void;
  imageData?: { [key: string]: string };
  onHoverEffect?: boolean;
  selectedImage: CurrentImage;
  controlerValue: ControlerValue;
}

export default function DownloadImage({
  imageBgStyle,
  onDownload = () => {},
  assignRef = () => {},
  imageData,
  onHoverEffect = true,
  selectedImage,
  controlerValue,
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
      className={`${
        controlerValue?.border?.value
      } w-full h-full overflow-hidden border-white border-8 ${
        onHoverEffect ? "hover:drop-shadow-md" : ""
      } transition duration-300`}
    >
      {onDownload && imageData?.id && (
        <Button
          onClick={() => onDownload(imageData.id)}
          variant="ghost"
          className={`hover:bg-black hover:bg-opacity-50 z-50 absolute w-full h-full transition-opacity duration-300 group`}
        >
          <Download className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white" />
        </Button>
      )}

      <div {...attr}>
        <Image
          placeholder="blur"
          blurDataURL={constants.blurDataURL}
          loading="lazy"
          src={selectedImage.imageURL}
          layout="fill"
          objectFit="cover"
          alt="profile pic"
          style={{ ...imageStyle }}
        />
      </div>
    </div>
  );
}
