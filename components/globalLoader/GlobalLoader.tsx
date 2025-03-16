"use client";

import Lottie from "lottie-react";
import lottiefilesLoader from "@/assets/lottiefiles/loader.json";
import { useAppProvider } from "@/lib/app-provider";

export default function GlobalLoader() {
  const { globalLoader } = useAppProvider();
  if (globalLoader)
    return (
      <div className="flex justify-center items-center fixed top-0 bottom-0 right-0 left-0 bg-neutral-950/90">
        <div className="text-center text-white p-2">
          <Lottie
            animationData={lottiefilesLoader}
            loop={true}
            className="w-52 m-auto"
          />
          <p>We&apos;re generating your image...</p>
          <p>
            This may take a few minutes depending on the image size. Thanks for
            your patience!
          </p>
        </div>
      </div>
    );
  return null;
}
