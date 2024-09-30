"use client";

import Lottie from "lottie-react";
import lottiefilesLoader from "@/assets/lottiefiles/loader.json";
import { useAppProvider } from "@/lib/app-provider";

export default function GlobalLoader() {
  const { globalLoader } = useAppProvider();
  if (globalLoader)
    return (
      <div className="flex justify-center items-center fixed top-0 bottom-0 right-0 left-0 bg-neutral-950/90">
        <div className="md:w-2/12 w-full max-w-full text-center text-white">
          <Lottie animationData={lottiefilesLoader} loop={true} className="" />
          <h2>We&apos;re generating your image...</h2>
          <p>This may take a few minutes. Thanks for your patience!</p>
        </div>
      </div>
    );
  return null;
}
