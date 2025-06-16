import textBehindImageConstants from "@/tools/text-behind-image/utils/TBIConstants";
import { ControlerValue } from "./interfaces";
import { client } from "@gradio/client";
import constants from "./constants";
import ppmConstants from "@/tools/profile-picture-maker/components/utils/ppmConstants";
import CIConstants from "@/tools/compress-image/utils/CIConstants";
import { jsPDF } from "jspdf";
import ITPDFConstants from "@/tools/image-to-pdf/utils/ITPDFConstants";

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
    className: `w-full slider bg-violet-500 rounded-full ${extraClass}`,
  },
});

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
      const rgba = rgbToRgba(rgbColors[index % rgbColors.length], "1");
      return `drop-shadow(${shadow} 0 ${rgba})`;
    })
    .join(" ");

  return { ...strokeVars, filter: dropShadows };
}

export function getImageStyle(controlerValue?: ControlerValue) {
  return controlerValue
    ? {
        scale: controlerValue.scale,
        transform: `rotate(${
          controlerValue?.rotate || 0
        }deg) translate(${calcPx(
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

export async function onHfImageGenerate(file: Blob) {
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

export async function onImageGenerate(file: Blob): Promise<Blob | null> {
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

export function getMetaData(key?: string) {
  const openGraphImages = {
    url: "/images/logo.png",
    width: 1200,
    height: 375,
  };
  const twitter = {
    card: "summary_large_image",
    images: ["/images/logo.png"],
  };
  switch (key) {
    case "text-behind-image":
      return {
        metadataBase: new URL(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/text-behind-image` ||
            "https://dpg.vercel.app/text-behind-image"
        ),
        title: `${textBehindImageConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: textBehindImageConstants.landingPage.subtitle,
        keywords: textBehindImageConstants.keywords.join(", "),
        openGraph: {
          title: `${textBehindImageConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: textBehindImageConstants.landingPage.subtitle,
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/text-behind-image`,
          siteName: `${textBehindImageConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          images: [
            {
              ...openGraphImages,
              alt: `${textBehindImageConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            },
          ],
          type: "website",
        },
        twitter: {
          ...twitter,
          title: `${textBehindImageConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: textBehindImageConstants.landingPage.subtitle,
        },
      };
    case "profile-picture-maker":
      return {
        metadataBase: new URL(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/profile-picture-maker` ||
            "https://dpg.vercel.app/profile-picture-maker"
        ),
        title: `${ppmConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: ppmConstants.landingPage.subtitle,
        keywords: ppmConstants.keywords.join(", "),
        openGraph: {
          title: `${ppmConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: ppmConstants.landingPage.subtitle,
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/profile-picture-maker`,
          siteName: `${ppmConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          images: [
            {
              ...openGraphImages,
              alt: `${ppmConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            },
          ],
          type: "website",
        },
        twitter: {
          ...twitter,
          title: `${ppmConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: ppmConstants.landingPage.subtitle,
        },
      };

    case "compress-image":
      return {
        metadataBase: new URL(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/compress-image` ||
            "https://dpg.vercel.app/compress-image"
        ),
        title: `${CIConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: CIConstants.landingPage.subtitle,
        keywords: CIConstants.landingPage.keywords.join(", "),
        openGraph: {
          title: `${CIConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: CIConstants.landingPage.subtitle,
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/compress-image`,
          siteName: `${CIConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          images: [
            {
              ...openGraphImages,
              alt: `${CIConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            },
          ],
          type: "website",
        },
        twitter: {
          ...twitter,
          title: `${CIConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: CIConstants.landingPage.subtitle,
        },
      };

    case "image-to-pdf":
      return {
        metadataBase: new URL(
          `${process.env.NEXT_PUBLIC_WEBSITE_URL}/image-to-pdf` ||
            "https://dpg.vercel.app/image-to-pdf"
        ),
        title: `${ITPDFConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: ITPDFConstants.landingPage.subtitle,
        keywords: ITPDFConstants.keywords.join(", "),
        openGraph: {
          title: `${ITPDFConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: ITPDFConstants.landingPage.subtitle,
          url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/image-to-pdf`,
          siteName: `${ITPDFConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          images: [
            {
              ...openGraphImages,
              alt: `${ITPDFConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            },
          ],
          type: "website",
        },
        twitter: {
          ...twitter,
          title: `${ITPDFConstants.title} | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: ITPDFConstants.landingPage.subtitle,
        },
      };

    default:
      return {
        metadataBase: new URL(
          process.env.NEXT_PUBLIC_WEBSITE_URL || "https://dpg.vercel.app/"
        ),
        title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        description: constants.landingPage.subtitle,
        keywords:
          "photo editing, background remover, image editor, customize images",
        openGraph: {
          title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: constants.landingPage.subtitle,
          url: process.env.NEXT_PUBLIC_WEBSITE_URL,
          siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
          images: [
            {
              ...openGraphImages,
              alt: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
            },
          ],
          type: "website",
        },
        twitter: {
          ...twitter,
          title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
          description: constants.landingPage.subtitle,
        },
      };
  }
}

// Helper: Convert Image to Base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const convertImagesToPdf = async (base64s: string[]) => {
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const pdf = new jsPDF();

  const _promises: Promise<any>[] = [];

  for (let i = 0; i < base64s.length; i++) {
    _promises.push(
      new Promise(async (resolve) => {
        const base64 = base64s[i];
        const img = await loadImage(base64);

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate ratio to fit within PDF page
        const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight);

        const displayWidth = imgWidth * ratio;
        const displayHeight = imgHeight * ratio;

        const x = (pageWidth - displayWidth) / 2; // center horizontally
        const y = (pageHeight - displayHeight) / 2; // center vertically
        return resolve({ base64, x, y, displayWidth, displayHeight });
      })
    );
  }

  const results = await Promise.all(_promises);
  results.forEach(({ base64, x, y, displayWidth, displayHeight }, index) => {
    pdf.addImage(base64, "JPEG", x, y, displayWidth, displayHeight);
    if (index < results.length - 1) {
      pdf.addPage();
    }
  });
  pdf.save("images.pdf");
};
