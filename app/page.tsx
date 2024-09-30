import constants from "@/lib/constants";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UploadImage from "@/components/dragAndDrop";
import ImageWrapper from "@/components/imageWrapper";
import { Button } from "@/components/ui/button";
import { auth } from "./api/auth/[...nextauth]";
import Image from "next/image";
import { getBorderColor, onImageGenerate } from "@/lib/common";
import GenerateImageBtn from "@/components/generateImageBtn";
import Lottie from "lottie-react";
import lottiefilesArrow from "@/assets/lottiefiles/arrow.json";
import BannerSection from "@/components/bannerSection";

export default async function Home() {
  return (
    <main className="text-black body-font">
      <section className="text-center container flex flex-col justify-center min-h-[75vh] mx-auto py-10 md:py-20">
        <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter lg:text-8xl md:text-7xl text-center">
          {constants.landingPage.title}
        </h1>
        <p className="mx-auto my-4 lg:text-2xl md:text-xl font-normal leading-relaxed text-gray-600 dark:text-gray-300 lg:w-2/3 text-center">
          {constants.landingPage.subtitle}
        </p>
        {/* <div className="py-20">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex justify-end">
              <div className="w-80 h-60 -rotate-12 border-8 border-white drop-shadow-2xl">
                <Image
                  alt="banner-dp"
                  src="/images/banner-dp.png"
                  style={{ objectFit: "cover" }}
                  fill={true}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-start">
                <div className="w-32 h-32 relative rotate-45 mt-10 ml-10">
                  <Image
                    alt="banner-dp"
                    src="/images/hand-drawn-right-curved-arrow.png"
                    style={{ objectFit: "contain" }}
                    fill={true}
                  />
                </div>
              </div>
              <GenerateImageBtn
                className={`${constants.btnClass} rounded-full mr-4 mr-4 `}
              />
              <div className="flex justify-end">
                <div className="w-32 h-32 relative rotate-180 mb-10 mr-10">
                  <Image
                    alt="banner-dp"
                    src="/images/hand-drawn-left-curved-arrow.png"
                    style={{ objectFit: "contain" }}
                    fill={true}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-cols items-end">
              <div className="flex mt-10">
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
                    style={{ ...item.bg }}
                    className={`w-40 h-40 ${
                      index > 0 ? "-ml-14" : ""
                    } border-4 border-white drop-shadow-2xl rounded-full overflow-hidden bg-cover`}
                  >
                    <Image
                      alt="banner-dp"
                      src="/images/banner-dp-png.png"
                      style={{ objectFit: "contain", ...item.borderColor }}
                      fill={true}
                      className="pt-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}

        <div className="">
          <BannerSection />
        </div>
        <p className="mx-auto my-10 lg:text-2xl md:text-xl font-normal leading-relaxed text-gray-600 dark:text-gray-300 lg:w-2/3 text-center">
          Picofme.io helps you create eye-catching profile pictures in just a
          few clicks. Using AI image background removal, our variations of
          backgrounds, outlines, and filters, your profile will look fantastic
          and help you to attract more audiences.
        </p>
      </section>
    </main>
  );
}
