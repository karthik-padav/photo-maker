import { client } from "@gradio/client";
import axios from "axios";

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
  console.log(result?.data, "imgURL123");

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

export function editImageControlers(controlerValue: {
  [key: string]: string | number;
}) {
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

export function sideMenuControlers(controlerValue: {
  [key: string]: string | number;
}) {
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

export function getImageStyle(controlerValue: { [key: string]: string }) {
  let imageStyle: { [key: string]: string } = {};
  if (controlerValue?.scale) imageStyle["scale"] = controlerValue.scale;
  if (controlerValue?.rotate && controlerValue?.transform)
    imageStyle[
      "transform"
    ] = `${controlerValue.transform} rotate(${controlerValue.rotate}deg)`;
  else if (controlerValue?.rotate)
    imageStyle["transform"] = `rotate(${controlerValue.rotate}deg)`;
  else if (controlerValue?.transform)
    imageStyle["transform"] = controlerValue.transform;
  return imageStyle;
}
