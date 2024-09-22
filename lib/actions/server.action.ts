"use server";
import { cookies } from "next/headers";
import { client } from "@gradio/client";
import axios from "axios";
import { ControlerValue } from "@/lib/interfaces";

export async function getCookie() {
  const cookieStore = cookies();
  return cookieStore.get("authjs.session-token");
}

export async function getHfToken() {
  return process.env.HF_TOKEN;
}

interface Params {
  controler: ControlerValue;
  controlerKey: string;
  imageId: string;
}

export async function updateControler(body: Params) {
  const cookies = await getCookie();
  console.log(body, "body123");
  return await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/updateControler`,
    body,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function getControler() {
  const cookies = await getCookie();
  console.log(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getControler`,
    "Base URL"
  );
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getControler`,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}

export async function getMyImages() {
  const cookies = await getCookie();
  return await axios.get(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/getImage`,
    { headers: { Authorization: `Bearer ${cookies?.value}` } }
  );
}
