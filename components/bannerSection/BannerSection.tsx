"use client";
import Lottie from "lottie-react";
import lottiefilesArrow from "@/assets/lottiefiles/arrow.json";
import GenerateImageBtn from "../generateImageBtn";
import constants from "@/lib/constants";
import { getBorderColor } from "@/lib/common";
import Image from "next/image";

export default function BannerSection() {
  return (
    <>
      <div className="flex justify-center my-10">
        <GenerateImageBtn
          className={`${constants.btnClass} rounded-full h-14 bg-violet-500 text-white`}
        />
        <Lottie
          animationData={lottiefilesArrow}
          loop={true}
          className="w-32 h-32 rotate-180 mt-10"
        />
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-4 md:w-4/12 w-full">
          {[
            {
              bg: { background: "rgb(139 92 246)" },
              borderColor: getBorderColor({
                pngBorderColor: "rgb(255, 228, 0)",
                pngShadow: "1",
              }),
            },
            {
              bg: {
                background:
                  "linear-gradient(to right, rgb(255, 226, 89), rgb(255, 167, 81))",
              },
              borderColor: getBorderColor({
                pngBorderColor: "rgb(255, 255, 255)",
                pngShadow: "1",
              }),
            },
            {
              bg: {
                background: "url(/images/bg/4.jpg)",
                backgroundSize: "cover",
              },
              borderColor: getBorderColor({
                pngBorderColor: "rgb(255, 65, 108)",
                pngShadow: "1",
              }),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="border-4 border-white drop-shadow-2xl rounded-full overflow-hidden relative"
            >
              <div
                style={{ ...item.bg }}
                className="aspect-w-1 aspect-h-1 w-full bg-cover"
              >
                <div className="drop-shadow-2xl rounded-full overflow-hidden w-full h-full">
                  <Image
                    alt="banner-dp"
                    src="/images/banner-dp-png.png"
                    style={{ objectFit: "contain", ...item.borderColor }}
                    fill={true}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
