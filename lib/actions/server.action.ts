"use server";
import { cookies } from "next/headers";

export async function getCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(
    `${process.env.NEXT_PUBLIC_WEBSITE_CODE}-session-token`
  );
}
