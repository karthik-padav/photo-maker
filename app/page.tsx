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
