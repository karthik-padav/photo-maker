import { ControlerValue } from "./interfaces";
import { toPng } from "html-to-image";
import { client } from "@gradio/client";

export const calcPercentage = (width: number, v: number) => (v / width) * 100;
export const calcPx = (width: number, v: number) => (v * width) / 100;

const createRangeControl = (
  label: string,
  min: number,
  max: number,
  step: number,
  value: number | string,
  extraClass = ""
) => ({
  label,
  valuePrefix: "",
  attr: {
    type: "range",
    min,
    max,
    step,
    value,
    className: `w-full slider dark:bg-accent bg-gray-200 ${extraClass}`,
  },
});

export function myPhotoControlers(controlerValue: ControlerValue | null) {
  return {
    rotate: createRangeControl(
      "Rotate",
      0,
      360,
      10,
      controlerValue?.rotate || 0
    ),
    scale: createRangeControl("Scale", 0.5, 2, 0.1, controlerValue?.scale || 1),
    pngShadow: createRangeControl(
      "Outline",
      0,
      5,
      1,
      controlerValue?.pngShadow || 0,
      "col-span-4"
    ),
  };
}

export function borderControlers(controlerValue: ControlerValue | null) {
  return {
    outerBorderWidth: createRangeControl(
      "Border Thickness",
      0,
      40,
      5,
      controlerValue?.outerBorderWidth || 0
    ),
    outerBorderOpacity: createRangeControl(
      "Border Opacity",
      0,
      1,
      0.1,
      controlerValue?.outerBorderOpacity || 1
    ),
  };
}

export function bgControlers(controlerValue: ControlerValue | null) {
  return {
    backgroundRotate: createRangeControl(
      "Background Rotate",
      0,
      360,
      20,
      controlerValue?.backgroundRotate || 0
    ),
    ...(controlerValue?.backgroundImagePath && {
      backgroundScale: createRangeControl(
        "Background Scale",
        0.5,
        2,
        0.1,
        controlerValue?.backgroundScale || 1
      ),
    }),
  };
}

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");
  return `rgb(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(
    hex.substring(2, 4),
    16
  )}, ${parseInt(hex.substring(4, 6), 16)})`;
};

const rgbToRgba = (rgb: string = "", opacity: string = "1") => {
  const rgbValues = rgb.match(/\d+/g);
  return rgbValues?.length ? `rgba(${rgbValues.join(", ")}, ${opacity})` : "";
};

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

  const dropShadows = [
    "var(--stroke-pos) 0",
    "var(--stroke-neg) 0",
    "0 var(--stroke-pos)",
    "0 var(--stroke-neg)",
    "var(--stroke-pos) var(--stroke-pos)",
    "var(--stroke-pos) var(--stroke-neg)",
    "var(--stroke-neg) var(--stroke-pos)",
    "var(--stroke-neg) var(--stroke-neg)",
  ]
    .map(
      (shadow, index) =>
        `drop-shadow(${shadow} 0 ${rgbColors[index % rgbColors.length]})`
    )
    .join(" ");

  return { ...strokeVars, filter: dropShadows };
}

export function getImageStyle(controlerValue?: ControlerValue) {
  return controlerValue
    ? {
        scale: controlerValue.scale,
        transform: `rotate(${controlerValue.rotate}deg)`,
        ...getBorderColor(controlerValue),
      }
    : {};
}

export function getBorderStyles(
  controlerValue?: ControlerValue,
  currentWidth?: number
) {
  const outerBorderWidth =
    controlerValue?.outerBorderWidth &&
    currentWidth &&
    controlerValue?.imageWrapperSize
      ? (Number(controlerValue.outerBorderWidth) * currentWidth) /
        controlerValue.imageWrapperSize
      : controlerValue?.outerBorderWidth;

  return outerBorderWidth && outerBorderWidth !== "0"
    ? {
        borderWidth: `${outerBorderWidth}px`,
        borderColor: rgbToRgba(
          controlerValue?.outerBorderColor || "",
          controlerValue?.outerBorderOpacity || "1"
        ),
      }
    : {};
}

export const getClientSideCookie = (name: string) => document.cookie;

export const extractValues = (input: string) =>
  input
    .match(/translate\(([-\d.]+)%, ([-\d.]+)%\)/)
    ?.slice(1)
    .map(parseFloat) || [];

export const onDownload = (
  el: HTMLDivElement | null,
  callback = (blob: Blob, dataUrl: string) => {}
) => {
  if (!el) return;
  toPng(el, { cacheBust: true, quality: 1, pixelRatio: 5 })
    .then(async (dataUrl) => {
      let blob = base64ToBlob(dataUrl, "image/png");
      blob = (await compressImageBlob(blob)) as Blob;
      callback(blob, dataUrl);
    })
    .catch(console.log);
};

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function onHfImageGenerate(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e?.target?.files?.[0];

  const app = await client("https://briaai-bria-rmbg-1-4.hf.space/");
  const result = (await app.predict("/predict", [file])) as {
    data: { path: string };
  };
  console.log(result, "result123123");
  if (result?.data?.[0]?.path) {
    const response = await fetch(
      `https://briaai-bria-rmbg-1-4.hf.space/file=${result.data[0].path}`
    );
    return await response.blob();
  }
  return;
}

export async function onImageGenerate(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e?.target?.files?.[0];
  if (!file) return null;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (!reader.result) return;

      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);

      const worker = new Worker(
        new URL("@/workers/backgroundWorker.ts", import.meta.url),
        { type: "module" }
      );

      worker.postMessage({ imageData: uint8Array });

      worker.onmessage = async (message) => {
        if (message.data.success) {
          const blob = message.data.blob;
          resolve(blob);
        } else {
          console.error("Background removal failed:", message.data.error);
          resolve(null);
        }
        worker.terminate();
      };
    };

    reader.readAsArrayBuffer(file); // ✅ Read file as ArrayBuffer
  });
}

const base64ToBlob = (base64: string, mimeType: string) => {
  const byteString = atob(base64.split(",")[1] || base64);
  return new Blob([Uint8Array.from(byteString, (c) => c.charCodeAt(0))], {
    type: mimeType,
  });
};

async function compressImageBlob(
  imageBlob: Blob,
  maxWidth = 800,
  quality = 0.7
) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(imageBlob);
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      const canvas = Object.assign(document.createElement("canvas"), {
        width: img.width * Math.min(maxWidth / img.width, 1),
        height: img.height * Math.min(maxWidth / img.width, 1),
      });
      canvas
        .getContext("2d")
        ?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error("Compression failed")),
        "image/jpeg",
        quality
      );
    };
    img.onerror = reject;
  });
}
