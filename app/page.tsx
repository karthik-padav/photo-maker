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
import Payment from "@/components/payment";

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
        <BannerSection />
        <p className="mx-auto my-10 lg:text-2xl md:text-xl font-normal leading-relaxed text-gray-600 dark:text-gray-300 lg:w-2/3 text-center">
          <Link
            href={process.env.NEXT_PUBLIC_WEBSITE_URL || "/"}
            className="text-violet-500"
          >
            {process.env.NEXT_PUBLIC_WEBSITE_LABEL}
          </Link>{" "}
          enables you to create professional, eye-catching profile pictures
          effortlessly. With advanced AI-powered background removal,
          customizable backgrounds, outlines, and filters, you can elevate your
          profile&apos;s appeal and effectively engage a broader audience. makes
          it easy to enhance your profile and attract a wider audience.
        </p>
      </section>

      {/* <section>
        <Payment />
      </section> */}
    </main>
  );
}
