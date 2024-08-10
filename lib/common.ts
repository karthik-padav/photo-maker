import { client } from "@gradio/client";
import axios from "axios";
import { ControlerValue } from "./interfaces";
import { getHfToken } from "./actions/server.action";

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
        value: controlerValue.rotate || 0,
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
        value: controlerValue.scale || 1,
        step: 0.1,
        className: "w-full slider dark:bg-accent bg-gray-200",
      },
    },
    pngShadow: {
      label: "Border Color",
      valuePrefix: "px",
      className: "col-span-4",
      attr: {
        type: "range",
        min: 0,
        max: 5,
        step: 1,
        value: controlerValue.pngShadow || 2,
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
  let imageStyle: any = {};
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
  if (bgImage.length) imageBgStyle["backgroundImage"] = bgImage.join(",");
  return imageBgStyle;
}

export const getClientSideCookie = (name: string) => {
  const cookieValue = document.cookie;
  // .split("; ")
  // .find((row) => row.startsWith(`${name}=`))
  // ?.split("=")[1];

  return cookieValue;
};
