"use client";

import { useAppProvider } from "@/lib/app-provider";
import { LoaderCircle } from "lucide-react";

export default function GlobalLoader() {
  const { globalLoader } = useAppProvider();
  if (globalLoader)
    return (
      <div className="flex justify-center items-center fixed top-5 right-5 bg-violet-500/90 max-w-full text-white p-4 rounded-sm ">
        <p>We&apos;re Generating Your Image</p>
        <LoaderCircle className="animate-spin w-8 h-8 ml-2" />
      </div>
    );
  return null;
}
