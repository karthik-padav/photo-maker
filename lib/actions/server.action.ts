"use server";
import { cookies } from "next/headers";

export async function getCookie() {
  const cookieStore = cookies();
  return cookieStore.get("authjs.session-token");
}

export async function getHfToken() {
  return process.env.HF_TOKEN;
}
