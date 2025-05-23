"use client";
import Lottie from "lottie-react";
import lottiefilesArrow from "@/assets/lottiefiles/arrow.json";

export default function BannerSection() {
  return (
    <>
      <div className="flex justify-center my-10">
        <Lottie
          animationData={lottiefilesArrow}
          loop={true}
          className="w-32 h-32 rotate-180"
        />
      </div>
    </>
  );
}
