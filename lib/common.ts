import axios from "axios";
import { ControlerValue } from "./interfaces";
import { toPng } from "html-to-image";
import { generateImage } from "./actions/services";
import { uid } from "uid";
import { removeBackground } from "@imgly/background-removal";

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
  let obj = {
    backgroundRotate: {
      label: "Rotate",
      valuePrefix: "°",
      attr: {
        type: "range",
        min: 0,
        max: 360,
        step: 20,
        value: controlerValue?.backgroundRotate || 0,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
  };
  if (controlerValue?.backgroundImagePath)
    obj["backgroundScale"] = {
      label: "Zoom In",
      valuePrefix: "",
      attr: {
        type: "range",
        min: 0.5,
        max: 2,
        step: 0.1,
        value: controlerValue?.backgroundScale || 1,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    };

  return obj;
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

  if (!px || px === "0" || !rgbColors?.length) return {};

  const strokeVars = {
    "--stroke-pos": `${px}px`,
    "--stroke-neg": `-${px}px`,
  };

  // Generate drop-shadow dynamically based on available colors
  const dropShadows = [
    ["var(--stroke-pos)", "0"],
    ["var(--stroke-neg)", "0"],
    ["0", "var(--stroke-pos)"],
    ["0", "var(--stroke-neg)"],
    ["var(--stroke-pos)", "var(--stroke-pos)"],
    ["var(--stroke-pos)", "var(--stroke-neg)"],
    ["var(--stroke-neg)", "var(--stroke-pos)"],
    ["var(--stroke-neg)", "var(--stroke-neg)"],
  ];

  const filter = dropShadows
    .map(
      (shadow, index) =>
        `drop-shadow(${shadow[0]} ${shadow[1]} 0 ${
          rgbColors[index % rgbColors.length]
        })`
    )
    .join(" ");

  return { ...strokeVars, filter };
}

export function getImageStyle(controlerValue: ControlerValue | undefined) {
  let imageStyle: any = {};
  if (controlerValue?.scale) imageStyle["scale"] = controlerValue.scale;
  // if (controlerValue?.rotate && controlerValue?.transformX && controlerValue?.transformY)
  //   imageStyle[
  //     "transform"
  //   ] = `${controlerValue.transform} rotate(${controlerValue.rotate}deg)`;
  // else if (controlerValue?.rotate)
  //   imageStyle["transform"] = `rotate(${controlerValue.rotate}deg)`;
  if (controlerValue?.rotate)
    imageStyle["transform"] = `rotate(${controlerValue.rotate}deg)`;
  if (controlerValue)
    imageStyle = { ...imageStyle, ...getBorderColor(controlerValue) };
  return imageStyle;
}

export function getBorderStyles(
  controlerValue: ControlerValue | undefined,
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
  callback = (blob: Blob, dataUrl: string) => {}
) => {
  if (el) {
    try {
      toPng(el, {
        cacheBust: true,
        quality: 1,
        pixelRatio: 5,
      }).then(async (dataUrl) => {
        let blob = base64ToBlob(dataUrl, "image/png");
        blob = (await compressImageBlob(blob)) as Blob;
        callback(blob, dataUrl);
      });
    } catch (error) {
      console.log(error);
    }
  }
};

export async function onImageGenerate(e: React.ChangeEvent<HTMLInputElement>) {
  let file: File | null = e?.target?.files?.[0] || null;
  if (file) {
    let blob = new Blob([file], { type: file.type });
    // const imageUrl = URL.createObjectURL(file);
    blob = await removeBackground(file);
    if (!blob) throw new Error("'Blob not found");
    return await generateImage({ blob, fileName: file.name });
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

async function compressImageBlob(
  imageBlob: Blob,
  maxWidth = 800,
  quality = 0.7
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(imageBlob);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement("canvas");
      const scaleFactor = Math.min(maxWidth / img.width, 1);
      canvas.width = img.width * scaleFactor;
      canvas.height = img.height * scaleFactor;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Compression failed"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = reject;
    img.src = url;
  });
}
