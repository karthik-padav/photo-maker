"use server";
import { cookies } from "next/headers";

export async function getCookie() {
  const cookieStore = cookies();
  return cookieStore.get(
    `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-session-token`
  );
}

export async function getHfToken() {
  return process.env.HF_TOKEN;
}
