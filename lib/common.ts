import { client } from "@gradio/client";
import axios from "axios";
import { BgPngImage, ControlerValue } from "./interfaces";
import { getHfToken } from "./actions/server.action";
import { toPng } from "html-to-image";
import { updateImage } from "./actions/services";
import { uid } from "uid";

export async function rembg(blob: Blob) {
  try {
    const token = await getHfToken();
    if (!token) throw new Error("HF token not found.");
    if (!process.env.NEXT_PUBLIC_HUGGING_FACE_SPACE_URL)
      throw new Error("HF space URL not found.");

    const app = await client(process.env.NEXT_PUBLIC_HUGGING_FACE_SPACE_URL, {
      hf_token: token as `hf_${string}` | undefined,
    });
    const result: any = await app.predict("/predict", [blob]);

    if (!result?.data?.[0]?.path) return false;

    const imgURL = `${process.env.NEXT_PUBLIC_HUGGING_FACE_SPACE_URL}file=${result?.data?.[0]?.path}`;

    const response = await axios.get(imgURL, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });
    return response?.data;
  } catch (error) {
    console.log(error);
  }
}

export const calcPercentage = (width: number, v: number) => (v / width) * 100;

export const calcPx = (width: number, v: number) => (v * width) / 100;

export function myPhotoControlers(controlerValue: ControlerValue | null) {
  return {
    rotate: {
      label: "Rotate",
      valuePrefix: "",
      attr: {
        type: "range",
        min: 0,
        max: 360,
        step: 20,
        value: controlerValue?.rotate || 0,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
    scale: {
      label: "Scale",
      valuePrefix: "",
      attr: {
        type: "range",
        min: 0.5,
        max: 2,
        value: controlerValue?.scale || 1,
        step: 0.1,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
    pngShadow: {
      label: "Outline",
      valuePrefix: "",
      className: "col-span-4",
      attr: {
        type: "range",
        min: 0,
        max: 5,
        step: 1,
        value: controlerValue?.pngShadow || 0,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
  };
}

export function borderControlers(controlerValue: ControlerValue | null) {
  return {
    outerBorderWidth: {
      label: "Thickness",
      convertToPerc: true,
      valuePrefix: "",
      attr: {
        type: "range",
        min: 0,
        max: 40,
        step: 5,
        value: controlerValue?.outerBorderWidth || 0,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
    outerBorderOpacity: {
      label: "Opacity",
      valuePrefix: "",
      attr: {
        type: "range",
        min: 0,
        max: 1,
        value: controlerValue?.outerBorderOpacity || 1,
        step: 0.1,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
  };
}

export function bgControlers(controlerValue: ControlerValue | null) {
  return {
    bgSize: {
      label: "Zoom In",
      valuePrefix: "",
      attr: {
        type: "range",
        min: 50,
        max: 200,
        step: 10,
        value: controlerValue?.bgSize || 100,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
  };
}

export function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, "");
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

function rgbToRgba(rgb: string = "", opacity: string = "1") {
  const rgbValues = rgb.match(/\d+/g);
  if (rgbValues?.length)
    return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${opacity})`;
  return "";
}

export function getBorderColor(controlerValue: ControlerValue) {
  const rgbColors = (controlerValue?.pngBorderColor || "").match(
    /rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/g
  );
  const px = controlerValue?.pngShadow;
  if (!px || px === "0") return {};
  if (rgbColors?.length === 1)
    return {
      "--stroke-pos": `${1 + Number(px)}px`,
      "--stroke-neg": `-${px}px`,
      "--stroke-color": rgbColors?.[0] || "rgb(255, 228, 0)",
      filter:
        "drop-shadow(var(--stroke-pos) 0 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(0 var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(0 var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(var(--stroke-pos) var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(var(--stroke-pos) var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) var(--stroke-neg) 0 var(--stroke-color))",
    };
  if (rgbColors?.length === 2)
    return {
      "--stroke-pos": `${px}px`,
      "--stroke-neg": `-${px}px`,
      "--stroke-color-start": rgbColors?.[0],
      "--stroke-color-end": rgbColors?.[1],
      filter: `drop-shadow(var(--stroke-pos) 0 0 var(--stroke-color-start)) 
  drop-shadow(var(--stroke-neg) 0 0 var(--stroke-color-end)) 
  drop-shadow(0 var(--stroke-pos) 0 var(--stroke-color-start)) 
  drop-shadow(0 var(--stroke-neg) 0 var(--stroke-color-end)) 
  drop-shadow(var(--stroke-pos) var(--stroke-pos) 0 var(--stroke-color-start)) 
  drop-shadow(var(--stroke-pos) var(--stroke-neg) 0 var(--stroke-color-end)) 
  drop-shadow(var(--stroke-neg) var(--stroke-pos) 0 var(--stroke-color-start)) 
  drop-shadow(var(--stroke-neg) var(--stroke-neg) 0 var(--stroke-color-end))`,
    };
  return {};
}

export function getImageStyle(controlerValue: ControlerValue) {
  let imageStyle: any = {};
  if (controlerValue?.scale) imageStyle["scale"] = controlerValue.scale;
  if (controlerValue?.rotate && controlerValue?.transform)
    imageStyle[
      "transform"
    ] = `${controlerValue.transform} rotate(${controlerValue.rotate}deg)`;
  else if (controlerValue?.rotate)
    imageStyle["transform"] = `rotate(${controlerValue.rotate}deg)`;
  // else if (controlerValue?.transform)
  //   imageStyle["transform"] = controlerValue.transform;
  imageStyle = { ...imageStyle, ...getBorderColor(controlerValue) };
  return imageStyle;
}

export function getBorderStyles(
  controlerValue: ControlerValue,
  currentWidth: number | undefined
) {
  let borderStyle: { [key: string]: string } = {};
  const outerBorderWidth =
    controlerValue?.imageWrapperSize &&
    controlerValue?.outerBorderWidth &&
    currentWidth
      ? (Number(controlerValue.outerBorderWidth) * currentWidth) /
        controlerValue.imageWrapperSize
      : controlerValue?.outerBorderWidth;

  if (outerBorderWidth && outerBorderWidth !== "0") {
    borderStyle["borderWidth"] = `${outerBorderWidth}px`;
    borderStyle["borderWidth"] = `${outerBorderWidth}px`;

    if (controlerValue?.outerBorderColor)
      borderStyle["borderColor"] = rgbToRgba(
        controlerValue.outerBorderColor,
        controlerValue.outerBorderOpacity || "1"
      );
  }

  return borderStyle;
}

export function getBgStyles({
  item,
  controlerValue,
}: {
  item?: BgPngImage;
  controlerValue: ControlerValue;
}) {
  let imageBgStyle: { [key: string]: string } = {};
  let bgImage = [];
  let _bgImage = controlerValue?.bgImage || item?.bgImage;
  if (_bgImage) bgImage.push(`url(${_bgImage})`);
  imageBgStyle["backgroundSize"] = `${controlerValue?.bgSize || "100"}% ${
    controlerValue?.bgSize || "100"
  }%`;
  imageBgStyle["backgroundRepeat"] = "no-repeat";
  imageBgStyle["backgroundPosition"] = "center center";
  if (controlerValue?.backgroundColor?.type === "bg")
    imageBgStyle["backgroundColor"] = controlerValue.backgroundColor.color;
  else if (controlerValue?.backgroundColor?.type === "bgg")
    bgImage.push(controlerValue.backgroundColor.color);
  if (bgImage.length) imageBgStyle["backgroundImage"] = bgImage.join(",");
  // if (controlerValue?.transform)
  //   imageBgStyle["transform"] = controlerValue.transform;

  return imageBgStyle;
}

export const getClientSideCookie = (name: string) => {
  const cookieValue = document.cookie;
  // .split("; ")
  // .find((row) => row.startsWith(`${name}=`))
  // ?.split("=")[1];

  return cookieValue;
};

export const extractValues = (input: string) => {
  const regex = /translate\(([-\d.]+)%, ([-\d.]+)%\)/;
  const matches = input?.match(regex);
  if (matches) {
    return [parseFloat(matches[1]), parseFloat(matches[2])];
  }
  return [];
};

export const onDownload = (
  el: HTMLDivElement | null,
  callback = (blob: Blob) => {}
) => {
  if (el) {
    toPng(el, {
      cacheBust: true,
      quality: 0.5,
      pixelRatio: 5,
    })
      .then((dataUrl) => {
        const blob = base64ToBlob(dataUrl, "image/png");
        callback(blob);
        const link = document.createElement("a");
        link.download = `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-${uid(16)}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export async function onImageGenerate(e: React.ChangeEvent<HTMLInputElement>) {
  let file: File | null = e?.target?.files?.[0] || null;
  if (file) {
    try {
      let blob = new Blob([file], { type: file.type });
      blob = await rembg(blob);
      if (!blob) throw new Error("'Blob not found");
      return await updateImage({ blob, fileName: file.name });
    } catch (error) {
      console.log(error);
      return;
    }
  }
}

function base64ToBlob(base64: string, mimeType: string) {
  // Remove the base64 prefix if present (e.g., "data:image/png;base64,")
  const byteString = atob(base64.split(",")[1] || base64);

  // Create an array buffer to hold the binary data
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  // Convert the binary string to a Uint8Array
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  // Create a Blob object from the ArrayBuffer and define the MIME type
  return new Blob([arrayBuffer], { type: mimeType });
}
