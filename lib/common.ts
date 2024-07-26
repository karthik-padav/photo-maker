import { client } from "@gradio/client";
import axios from "axios";
import { ControlerValue } from "./interfaces";

export async function rembg(blob: Blob) {
  const token = process.env.NEXT_PUBLIC_HF_TOKEN;
  const app = await client(
    `${process.env.NEXT_PUBLIC_HUGGING_FACE_SPACE_URL}`,
    {
      hf_token: token as `hf_${string}` | undefined,
    }
  );
  const result: any = await app.predict("/predict", [blob]);

  if (!result?.data?.[0]?.path) return false;

  const imgURL = `${process.env.NEXT_PUBLIC_HUGGING_FACE_SPACE_URL}file=${result?.data?.[0]?.path}`;

  const response = await axios.get(imgURL, {
    headers: {
      Authorization: `Bearer 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`,
    },
    responseType: "blob",
  });
  return response?.data;
}

export function getControler() {
  return {
    border: { title: "Round", value: "rounded-full" },
  };
}

export function editImageControlers(controlerValue: ControlerValue) {
  return {
    rotate: {
      label: "Rotate",
      valuePrefix: "%",
      attr: {
        type: "range",
        min: 0,
        max: 360,
        step: 20,
        value: controlerValue.rotate,
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
        defaultValue: 1,
        value: controlerValue.scale,
        step: 0.1,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
  };
}

export function customImageControlers(controlerValue: ControlerValue) {
  return {
    // backgroundColor: {
    //   label: "Border",
    //   valuePrefix: "px",
    //   className: "col-span-2",
    //   attr: {
    //     type: "color",
    //     min: 0,
    //     max: 5,
    //     step: 1,
    //     value: controlerValue.pngShadow,
    //     className: "w-full slider dark:bg-accent bg-gray-200",
    //   },
    // },
    // pngBorderColor: {
    //   label: "BG Color",
    //   valuePrefix: "px",
    //   className: "col-span-2",
    //   attr: {
    //     type: "color",
    //     min: 0,
    //     max: 5,
    //     step: 1,
    //     value: controlerValue.pngShadow,
    //     className: "w-full slider dark:bg-accent bg-gray-200",
    //   },
    // },
    pngShadow: {
      label: "Border Color",
      valuePrefix: "px",
      className: "col-span-4",
      attr: {
        type: "range",
        min: 0,
        max: 5,
        step: 1,
        value: controlerValue.pngShadow,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
  };
}

function getBorderColor(controlerValue: ControlerValue) {
  const rgbColors = (controlerValue?.pngBorderColor || "").match(
    /rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)/g
  );
  const px = controlerValue?.pngShadow;
  if (!px || px === "0") return {};
  if (rgbColors?.length === 1)
    return {
      "--stroke-pos": `${px}px`,
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
  let imageStyle: { [key: string]: string | number } = {};
  if (controlerValue?.scale) imageStyle["scale"] = controlerValue.scale;
  if (controlerValue?.rotate && controlerValue?.transform)
    imageStyle[
      "transform"
    ] = `${controlerValue.transform} rotate(${controlerValue.rotate}deg)`;
  else if (controlerValue?.rotate)
    imageStyle["transform"] = `rotate(${controlerValue.rotate}deg)`;
  else if (controlerValue?.transform)
    imageStyle["transform"] = controlerValue.transform;
  imageStyle = { ...imageStyle, ...getBorderColor(controlerValue) };
  return imageStyle;
}

export function getImageBgStyle({
  item,
  controlerValue,
}: {
  item?: { [key: string]: string } | null;
  controlerValue: ControlerValue;
}) {
  let imageBgStyle: { [key: string]: string } = {};
  let bgImage = [];
  if (item?.url) bgImage.push(`url(${item.url})`);
  if (controlerValue?.backgroundColor?.type === "bg")
    imageBgStyle["backgroundColor"] = controlerValue.backgroundColor.color;
  else if (controlerValue?.backgroundColor?.type === "bgg")
    bgImage.push(controlerValue.backgroundColor.color);
  imageBgStyle["backgroundImage"] = bgImage.join(",");
  return imageBgStyle;
}
