import axios from "axios";
import { ControlerValue } from "../interfaces";
import { getCookie } from "./server.action";

interface Params {
  controler: ControlerValue;
  imageId: string;
  blob: Blob;
}

export async function createControler(body: Params) {
  const cookies = await getCookie();
  const formData = new FormData();
  const { blob, ...rest } = body;
  const {
    border,
    rotate,
    scale,
    transformX,
    transformY,
    pngShadow,
    pngShadowOpacity,
    pngBorderColor,
    outerBorderOpacity,
    outerBorderWidth,
    outerBorderColor,
    imageWrapperSize,
    imageId,
    backgroundColor,
    backgroundColorType,
    backgroundRotate,
    backgroundImagePath,
    backgroundScale,
  } = { ...rest.controler, ...rest };

  let payload = {
    imageWrapperSize,
    rotate,
    scale,
    pngShadow,
    pngShadowOpacity,
    pngBorderColor,
    outerBorderColor,
    outerBorderOpacity,
    outerBorderWidth,
    backgroundImagePath,
    imageId,
    backgroundScale,
    backgroundColorType,
    backgroundRotate,
    backgroundColor,
    borderRadius: border?.value || 0,
    ...(transformX && transformY ? { transformX, transformY } : {}),
  };
  formData.append("file", blob);
  formData.append("data", JSON.stringify(payload));

  return await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/createControler`,
    formData,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function getControler() {
  try {
    const cookies = await getCookie();
    return await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getControler`,
      { headers: { Authorization: `Bearer ${cookies?.value}` } }
    );
  } catch (error) {
    console.log("Error in fetching controler", error);
    return { data: null };
  }
}

export async function getMyImages() {
  const cookies = await getCookie();
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getImage`,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function generateImage({
  blob,
  fileName,
}: {
  blob: Blob;
  fileName: string;
}) {
  const cookies = await getCookie();
  const formData = new FormData();
  formData.append("file", blob, fileName);
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/generateImage`,
    formData,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function deleteImage({ id }: { id: string }) {
  const cookies = await getCookie();
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deleteImage`,
    { id },
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function deleteControler({ id }: { id: string }) {
  const cookies = await getCookie();
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/deleteControler`,
    { id },
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function geUser() {
  const cookies = await getCookie();
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getUser`,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function getWebsiteData() {
  return await axios.get(
    "https://raw.githubusercontent.com/karthik-padav/public-data/refs/heads/main/upssp.json"
  );
}

export async function getAllBgImage() {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getAllBgImage`
  );
}
