import { ControlerValue } from "./interfaces";
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
    scale: createRangeControl("Zoom", 0.5, 2, 0.1, controlerValue?.scale || 1),
    pngShadow: createRangeControl(
      "Outline",
      0,
      5,
      1,
      controlerValue?.pngShadow || 0
    ),
    pngShadowOpacity: createRangeControl(
      "Outline Opacity",
      0,
      1,
      0.1,
      controlerValue?.pngShadowOpacity || 1
    ),
  };
}

export function borderControlers(controlerValue: ControlerValue | null) {
  return {
    outerBorderWidth: createRangeControl(
      "Border Thickness",
      0,
      100,
      10,
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
    backgroundScale: createRangeControl(
      "Zoom",
      0.5,
      3,
      0.1,
      controlerValue?.backgroundScale || 1
    ),
  };
}

export const hexToRgb = (hex: string) => {
  hex = hex.replace(/^#/, "");
  return `rgb(${parseInt(hex.substring(0, 2), 16)}, ${parseInt(
    hex.substring(2, 4),
    16
  )}, ${parseInt(hex.substring(4, 6), 16)})`;
};

export function rgbToRgba(rgbGradient, opacity = "1") {
  return rgbGradient.replace(/rgb\((\d+), (\d+), (\d+)\)/g, (_, r, g, b) => {
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  });
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
    .map((shadow, index) => {
      const rgba = rgbToRgba(
        rgbColors[index % rgbColors.length],
        controlerValue?.pngShadowOpacity || "1"
      );
      return `drop-shadow(${shadow} 0 ${rgba})`;
    })
    .join(" ");

  return { ...strokeVars, filter: dropShadows };
}

export function getImageStyle(controlerValue?: ControlerValue) {
  return controlerValue
    ? {
        scale: controlerValue.scale,
        transform: `rotate(${controlerValue.rotate}deg) translate(${calcPx(
          controlerValue?.imageWrapperSize || 100,
          controlerValue?.transformX || 0
        )}px, ${calcPx(
          controlerValue?.imageWrapperSize || 100,
          controlerValue?.transformY || 0
        )}px)`,

        ...getBorderColor(controlerValue),
      }
    : {};
}

export function getOuterBorderStyle(controlerValue?: ControlerValue) {
  if (
    !controlerValue?.outerBorderWidth ||
    controlerValue.outerBorderWidth === "0" ||
    controlerValue?.outerBorderOpacity === "0"
  )
    return {};
  let style = { backgroundColor: "transparent" };
  if (controlerValue?.outerBorderWidth) {
    style["borderWidth"] = `${controlerValue.outerBorderWidth}px`;
    style["borderStyle"] = "solid";
  }
  if (
    controlerValue?.outerBorderColor &&
    controlerValue.outerBorderColor.includes("linear-gradient")
  ) {
    style["borderImageSource"] = rgbToRgba(
      controlerValue.outerBorderColor,
      controlerValue?.outerBorderOpacity || "1"
    );
    style["borderImageSlice"] = "1";
  } else
    style["borderColor"] =
      rgbToRgba(
        controlerValue.outerBorderColor,
        controlerValue?.outerBorderOpacity || "1"
      ) || "white";

  return style;
}

export const getClientSideCookie = (name: string) => document.cookie;

export const extractValues = (input: string) =>
  input
    .match(/translate\(([-\d.]+)%, ([-\d.]+)%\)/)
    ?.slice(1)
    .map(parseFloat) || [];

export const resizedImage = async (originalCanvas) => {
  if (!originalCanvas) return;

  const targetSize = 800;

  // Create an offscreen canvas for resizing
  const offscreenCanvas = document.createElement("canvas");
  const ctx = offscreenCanvas.getContext("2d");

  if (!ctx) return;

  // Set the new canvas dimensions
  offscreenCanvas.width = targetSize;
  offscreenCanvas.height = targetSize;

  // Draw the original image resized onto the new canvas
  ctx.drawImage(originalCanvas, 0, 0, targetSize, targetSize);

  // Convert the resized canvas to a Blob (returning a Promise)
  return new Promise((resolve) => {
    offscreenCanvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
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
  if (result?.data?.[0]?.path) {
    console.log("HF triggered");
    return `https://briaai-bria-rmbg-1-4.hf.space/file=${result.data[0].path}`;
  }
  return null;
}

export async function onImageGenerate(
  e: React.ChangeEvent<HTMLInputElement>
): Promise<Blob | null> {
  const file = e?.target?.files?.[0];
  if (!file) return null;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async () => {
      if (!reader.result) return null;

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
          console.log("imgly triggered");
          resolve(blob);
        } else {
          console.error("Background removal failed:", message.data.error);
          resolve(null);
        }
        worker.terminate();
      };
    };

    reader.readAsArrayBuffer(file);
  });
}

const base64ToBlob = (base64: string, mimeType: string) => {
  const byteString = atob(base64.split(",")[1] || base64);
  return new Blob([Uint8Array.from(byteString, (c) => c.charCodeAt(0))], {
    type: mimeType,
  });
};

export function dataURLtoBase64(dataURL) {
  return dataURL.split(",")[1]; // Extract only the Base64 part
}
