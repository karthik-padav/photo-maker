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
        <div className="grid grid-cols-5 md:w-4/12 w-full ml-10">
          {["dp-1", "dp-3", "dp-2", "dp-4", "dp-5"].map((i) => (
            <div
              key={i}
              className="-ml-10 border-4 border-white drop-shadow-2xl rounded-full overflow-hidden relative"
            >
              <div className="aspect-w-1 aspect-h-1 w-full bg-cover">
                <div className="drop-shadow-2xl rounded-full overflow-hidden">
                  <Image
                    alt="banner-dp"
                    src={`/images/${i}.png`}
                    style={{ objectFit: "contain" }}
                    fill
                    sizes="100%"
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
